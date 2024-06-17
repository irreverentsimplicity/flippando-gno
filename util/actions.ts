import { saveToLocalStorage } from './localstorage';
import {
  defaultFaucetTokenKey,
  defaultMnemonicKey,
} from '../types/types';
import { defaultTxFee, GnoJSONRPCProvider, GnoWallet, GnoWSProvider } from '@gnolang/gno-js-client';
import {
  BroadcastTxCommitResult,
  TM2Error,
  TransactionEndpoint
} from '@gnolang/tm2-js-client';
import { generateMnemonic } from './crypto';
import Long from 'long';
import Config from './config';
import { constructFaucetError } from './errors';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  ErrorTransform
} from './errors';
import { UserFundedError } from '../types/errors';

// ENV values //
const wsURL: string = Config.GNO_WS_URL;
//const rpcURL: string = Config.GNO_JSONRPC_URL;
//const flippandoRealm: string = Config.GNO_FLIPPANDO_REALM;
//const faucetURL: string = Config.FAUCET_URL;
//const faucetURL: string = "https://faucet.flippando.xyz";
const defaultGasWanted: Long = new Long(800_000_0);
const customTXFee = '100000ugnot'

const cleanUpRealmReturn = (ret: string, callType: string) => {
  // maketx adds and extra quote at the end of the string
  // so we need to have 2 slice values, one from 9 chars, for eval transaction
  // and one from 11 chars, for maketx
  console.log("ret ", ret)
  if (callType == "maketx"){
    return ret.slice(2, -9).replace(/\\"/g, '"');
  }
  else if (callType == "eval"){
    return ret.slice(2, -9).replace(/\\"/g, '"');
  }
};
const decodeRealmResponse = (resp: string, callType: string) => {
  console.log("resp in decodeResponse ", resp)
  return cleanUpRealmReturn(atob(resp), callType);
};
const parsedJSONOrRaw = (data: string, nob64 = false, callType: string) => {
  const decoded = nob64 ? cleanUpRealmReturn(data, callType) : decodeRealmResponse(data, callType);
  try {
    return JSON.parse(decoded);
  } finally {
    return decoded;
  }
};

/**
 * Actions is a singleton logic bundler
 * that is shared throughout the game.
 *
 * Always use as Actions.getInstance()
 */
class Actions {
  private static instance: Actions;

  private static initPromise: Actions | PromiseLike<Actions>;
  private wallet: GnoWallet | null = null;
  private provider: GnoWSProvider | null = null;
  private providerJSON: GnoJSONRPCProvider | null = null;
  private faucetToken: string | null = null;
  private rpcURL: string = Config.GNO_JSONRPC_URL;  
  private flippandoRealm: string = Config.GNO_FLIPPANDO_REALM;
  private faucetURL: string = Config.FAUCET_URL;
  
  private constructor() {}

  public setRpcUrl(newRpcUrl: string): void {
    this.rpcURL = newRpcUrl;
    this.reinitializeProvider();
  }

  public setFaucetUrl(newFaucetUrl: string): void {
    this.faucetURL = newFaucetUrl;
  }

  public setFlippandoRealm(newFlippandoRealm: string): void {
    this.flippandoRealm = newFlippandoRealm;
  }

  private async reinitializeProvider(): Promise<void> {
    try {
        // Reinitialize the JSON RPC provider with the new URL
        this.providerJSON = new GnoJSONRPCProvider(this.rpcURL);
        if (this.wallet) {
            this.wallet.connect(this.providerJSON);
        }
        console.log("Provider reinitialized with new URL:", this.rpcURL);
    } catch (e) {
        console.error("Failed to reinitialize provider:", e);
    }
  }


  /**
   * Fetches the Actions instance. If no instance is
   * initialized, it initializes it
   */
  public static async getInstance(): Promise<Actions> {
    if (!Actions.instance) {
      Actions.instance = new Actions();
      Actions.initPromise = new Promise(async (resolve) => {
        await Actions.instance.initialize();
        resolve(Actions.instance);
      });
      return Actions.initPromise;
    } else {
      return Actions.initPromise;
    }
  }

  /**
   * Prepares the Actions instance
   * @private
   */
  private async initialize() {
    // Wallet initialization //

    // Try to load the mnemonic from local storage
    let mnemonic: string | null = localStorage.getItem(defaultMnemonicKey);
    if (!mnemonic || mnemonic === '') {
      // Generate a fresh mnemonic
      mnemonic = generateMnemonic();

      // Save the mnemonic to local storage
      saveToLocalStorage(defaultMnemonicKey, mnemonic);
    }
    try {
      // Initialize the wallet using the saved mnemonic
      this.wallet = await GnoWallet.fromMnemonic(mnemonic);
      console.log('saved mnemonic ', JSON.stringify(mnemonic))
      console.log(this.wallet);
      // Initialize the provider
      //this.provider = new GnoWSProvider(wsURL);
      this.providerJSON = new GnoJSONRPCProvider(this.rpcURL)
      console.log(this.providerJSON);
      // Connect the wallet to the provider
      this.wallet.connect(this.providerJSON);
    } catch (e) {
      //Should not happen
      console.error('Could not create wallet from mnemonic');
    }

    
    // Faucet token initialization //
    let faucetToken: string | null = localStorage.getItem(
      defaultFaucetTokenKey
    );
    if (faucetToken && faucetToken !== '') {
      // Faucet token initialized
      this.faucetToken = faucetToken;
      try {
        // Attempt to fund the account
        await this.fundAccount(this.faucetToken);
      } catch (e) {
        if (e instanceof UserFundedError) {
          console.log('User already funded.');
        } else {
          console.log('Could not fund user.');
        }
      }
    }
  }

  /**
   * Destroys the Actions instance, and closes any running services
   */
  public destroy() {
    if (!this.provider) {
      // Nothing to close
      return;
    }

    // Close out the WS connection
    //this.provider.closeConnection();
  }

  /**
   * Saves the faucet token to local storage
   * @param token the faucet token
   */
  public async setFaucetToken(token: string) {
    // Attempt to fund the account

    await this.fundAccount(token);
    this.faucetToken = token;
    localStorage.setItem(defaultFaucetTokenKey, token);
  }

  /**
   * Fetches the saved faucet token, if any
   */
  public getFaucetToken(): string | null {
    return this.faucetToken || localStorage.getItem(defaultFaucetTokenKey);
  }

  private gkLog(): Boolean {
    const wnd = window as { gnokeyLog?: Boolean };
    //return typeof wnd.gnokeyLog !== 'undefined' && wnd.gnokeyLog;
    return true;
  }

  /**
   * Return user Addres
   */
  public getWalletAddress() {
    return this.wallet?.getAddress();
  }

  public hasWallet() {
    return !!this.wallet;
  }

  /**
   * Return user Balance
   */
  public async getBalance() {
    return await this.wallet?.getBalance('ugnot');
  }
  /**
   * Performs a transaction, handling common error cases and transforming them
   * into known error types.
   */
  public async callMethod(
    method: string,
    args: string[] | null,
    gasWanted: Long = defaultGasWanted
  ): Promise<BroadcastTxCommitResult> {
    const gkLog = this.gkLog();
    try {
      if (gkLog) {
        const gkArgs = args?.map((arg) => '-args ' + arg).join(' ') ?? '';
        console.log(
          `$ gnokey maketx call -broadcast ` +
            `-pkgpath ${this.flippandoRealm} -gas-wanted ${gasWanted} -gas-fee ${defaultTxFee} ` +
            `-func ${method} ${gkArgs} test`
        );
      }
            
      const resp = (await this.wallet?.callMethod(
        this.flippandoRealm,
        method,
        args,
        TransactionEndpoint.BROADCAST_TX_COMMIT,
        undefined,
        {
          gasFee: defaultTxFee,
          gasWanted: gasWanted
        }
      )) as BroadcastTxCommitResult;
      if (gkLog) {
        console.info('response in call:', JSON.stringify(resp));
        const respData = resp.deliver_tx.ResponseBase.Data;
        if (respData !== null) {
          console.info('response (parsed):', parsedJSONOrRaw(respData, false, "maketx"));
          return parsedJSONOrRaw(respData, false, "maketx");
        }
      }
      return resp;
    } 
    catch (err) {
      if(err !== undefined){
        if (gkLog) {
          console.log('err:', err);
        }
        let error: TM2Error;
      const ex = err as { log?: string; message?: string } | undefined;
      if (
        typeof ex?.log !== 'undefined' &&
        typeof ex?.message !== 'undefined' &&
        ex.message.includes('abci.StringError')
      ) {
        error = ErrorTransform(err as TM2Error);
      }
      if (gkLog) {
        console.log('error in maketx:', error);
      }
      throw error;
    }
    }
  }

  public async evaluateExpression(expr: string): Promise<string> {
    const gkLog = this.gkLog();
    if (gkLog) {
      const quotesEscaped = expr.replace(/'/g, `'\\''`);
      console.info(
        `$ gnokey query vm/qeval --data '${this.flippandoRealm}'$'\\n''${quotesEscaped}'`
      );
    }

    const resp = (await this.providerJSON?.evaluateExpression(
      this.flippandoRealm,
      expr
    )) as string;

    if (gkLog) {
      console.info('evaluateExpression response:', parsedJSONOrRaw(resp, true, "eval"));
    }

    // Parse the response
    return parsedJSONOrRaw(resp, true, "eval");
  }

  /**
   * Fetches the current user's wallet address
   */
  public async getUserAddress(): Promise<string> {
    return (await this.wallet?.getAddress()) as string;
  }

  /****************
   * GAME ENGINE
   ****************/

  /**
   * Starts a new game
   * @param gameID the ID of the new game
   */
  async startGame(
    player: string,
    gameType: string,
    boardSize: string,
  ): Promise<any> {
    // Make the move
    const startNewGame = await this.callMethod('StartGame', [
      player,
      gameType,
      boardSize
    ]);
    console.log("actions startGame response ", JSON.stringify(startNewGame))
    return startNewGame;
  }

  /**
   * Test the svg generation on a solved game
   * @param solvedBoard array of ints
   * @param int board size
   */
  async testBoard(
    solvedBoard: string,
    boardSize: string,
  ): Promise<any> {
    // Make the move
    const svgBoard = await this.callMethod('TileTest', [
      solvedBoard,
      boardSize
    ]);
    console.log("actions TestTile response ", JSON.stringify(svgBoard))
    return svgBoard;
  }

  /**
   * Call the FlipTile function and return an ongoing game
   * @param playerAddr string
   * @param gameId string
   * @param withPositions array of ints, converted into string, e.g. [1,4]
   */
  async flipTiles(
    playerAddr: string,
    gameId: string,
    withPositions: string,
  ): Promise<any> {
    const gameObject = await this.callMethod('FlipTiles', [
      playerAddr,
      gameId,
      withPositions
    ]);
    console.log("actions FlipTiles response ", JSON.stringify(gameObject))
    return gameObject;
  }

  /**
   * Call the CreateNFT function and return an ongoing game
   * @param playerAddr string
   * @param gameId string
   * @param withPositions array of ints, converted into string, e.g. [1,4]
   */
  async createNFT(
    playerAddr: string,
    gameId: string,
  ): Promise<any> {
    const response = await this.callMethod('CreateBasicNFT', [
      playerAddr,
      gameId
    ]);
    console.log("actions createBasicNFT response ", JSON.stringify(response))
    return response;
  }

  /**
   * Generates a width x height canvas with bTokenIDs inside, as a composite NFT
   * @param playerAddr string
   * @param width string - canvas width
   * @param height string - canvas height
   * @param bTokenIDs array of ints, converted into string, e.g. [1,4] - basic NFTs tooken ids used in the canvas
   */
  async createCompositeNFT(
    playerAddr: string,
    width: string,
    height: string,
    bTokenIDs: string,
  ): Promise<any> {
    const response = await this.callMethod('CreateCompositeNFT', [
      playerAddr,
      width,
      height,
      bTokenIDs
    ]);
    console.log("actions createCompositeNFT response ", JSON.stringify(response))
    return response;
  }

  /**
   * Get both locked and unlocked FLIP balances for a user
   * @param playerAddr string
   */
  async GetFLIPBalance(
    playerAddr: string,
  ): Promise<any> {
    const response = await this.evaluateExpression("GetFLIPBalance(\"" + playerAddr + "\")")
    console.log("actions GetFLIPBalance response ", JSON.stringify(response))
    return response;
  }

  /**
   * Call the GetUserNFTs function and return an array of basic NFTs
   * @param playerAddr string
   */
  async getUserNFTs(
    playerAddr: string,
    readyToUse: string,
  ): Promise<any> {
    const response = await this.evaluateExpression("GetUserBasicFlipNFTs(\"" + playerAddr + "\", \"" + readyToUse +"\")")
    console.log("actions GetUserBasicNFTs response ", JSON.stringify(response))
    return response;
  }

  /**
   * All available NFTs for making art
   * @param forPlayer string - current player
   */
  async getAllNFTs(forPlayer: string): Promise<any> {
    const response = await this.evaluateExpression("GetAllBasicNFTs(\"" + forPlayer + "\")")
    //console.log("actions GetAllBasicNFTs response ", JSON.stringify(response))
    return response;
  }


    /**
   * 
   * @param bTokenIds string - stringified array of tokenIds
   */
    async getArtworkNFTs(bTokenIds: string): Promise<any> {
      const response = await this.evaluateExpression("GetBasicNFTsByTokenId(\"" + bTokenIds + "\")")
      //const response = await this.callMethod('GetBasicNFTsByTokenId', [bTokenIds]);
      console.log("actions getArtworkNFTs response ", JSON.stringify(response))
      return response;
    }
  
  /**
   * Call the GetFlipBalances function and return a JSON object
   * @param tokenID string
   */
  async getFlipBalances(playerAddr: string): Promise<any> {
    const response = await this.evaluateExpression("GetFlipBalances(\"" + playerAddr + "\")")
    //const response = await this.callMethod('GetFlipBalances', [
    //  playerAddr
    //]);
    //console.log("actions GetTokenURI response ", JSON.stringify(response))
    return response;
  }


  async getUserGamesByStatus(playerAddr: string, gameStatus: string): Promise<any> {
    //const response  = await this.callMethod('GetUserGamesByStatus', [
    //  playerAddr,
    //  gameStatus
    //]);
    const response = await this.evaluateExpression("GetUserGamesByStatus(\"" + playerAddr + "\", \"" + gameStatus +"\")")
    console.log("actions GetUserGamesByStatus response ", JSON.stringify(response))
    return response;
  }


  /**
   * Call the ListMArketplaceNFT function, returns nil on success
   * @param tokenID string
   * @param seller string
   * @param price string
   */
  async ListNFT(
    compositeTokenId: string,
    seller: string,
    price: string,
  ): Promise<any> {
    try {
      const response = await this.callMethod('ListMarketplaceNFT', [
        compositeTokenId, seller, price
      ]);
      console.log("actions ListMarketplaceNFT response ", JSON.stringify(response));
      return response;
    } catch (error) {
      // Log the error
      console.error('Error in ListNFT:', error);
  
      // Return a custom error message 
      return { error: 'An error occurred while listing this NFT.', details: error.message != undefined ? error.message : "no details"};
    }
  }
  

  /**
   * Call the RemoveMarketplaceNFT function, returns nil on success
   * @param compositeTokenId string
   * @param seller string
   */
  async RemoveNFTListing(
    compositeTokenId: string,
    seller: string,): Promise<any> {
    const response = await this.callMethod('RemoveMarketplaceNFT', [
      compositeTokenId, seller, 
    ]);
    console.log("actions RemoveListing response ", JSON.stringify(response))
    return response;
  }  

  /**
   * Call the BuyMarketplaceNFT function, returns nil on success
   * @param compositeTokenId string
   * @param buyer string
   */
  async BuyNFT(
    compositeTokenId: string,
    buyer: string,): Promise<any> {
      try {
        const response = await this.callMethod('BuyMarketplaceNFT', [
          compositeTokenId, buyer, 
        ]);
        console.log("actions BuyMarketplaceNFT response ", JSON.stringify(response));
        return response;
      } catch (error) {
        // Log the error
        console.error('Error in BuyNFT:', error);
    
        // Return a custom error message 
        return { error: 'An error occurred while buying this NFT.', details: error.message != undefined ? error.message : "no details"};
      }

  }
  
  /**
   * Call the GetListings function and return a JSON object
   * @param tokenID string
   */
  async getMarketPlaceListings(): Promise<any> {
    const response = await this.evaluateExpression("GetArtListings()")
    //const response = await this.callMethod('GetArtListings', []);
    console.log("actions GetListings response ", JSON.stringify(response))
    return response;
  }

  async getUserCompositeNFTs(playerAddr: string): Promise<any> {
    const response = await this.evaluateExpression("GetUserCompositeFlipNFTs(\"" + playerAddr + "\")")
    console.log("actions getUserCompositeNFTS ", JSON.stringify(response, null, 2));
    return response;
  }
  
  /**
   * Pings the faucet to fund the account before playing
   * @private
   */
  private async fundAccount(token: string): Promise<void> {
    console.log("Token:", token);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Uncomment or add other headers as needed
            //'faucet-token': token, // Assuming 'token' should be sent in the request headers
        },
        body: JSON.stringify({
            to: await this.wallet?.getAddress()
        })
    };

    // Ensure faucetURL is defined and correct
    if (!this.faucetURL) {
        console.error("Faucet URL is undefined.");
        return;
    }

    try {
        const response = await fetch(this.faucetURL, requestOptions);
        const data = await response.json(); // Assuming the server responds with JSON
        console.log("Faucet URL:", this.faucetURL);
        console.log("Fund Response:", JSON.stringify(data, null, 2));
        
        if (!response.ok) {
            // Log more detailed error information
            console.error("Fund error:", data.message || "Unknown error");
        }
    } catch (error) {
        // Catch network errors, parsing errors, etc.
        console.error("Error during fetch:", error);
    }
}

}

export default Actions;