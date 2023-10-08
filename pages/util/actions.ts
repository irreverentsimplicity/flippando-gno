import { saveToLocalStorage } from './localstorage';
import {
  defaultFaucetTokenKey,
  defaultMnemonicKey,
  Game,
  type GameSettings,
  GameState,
  Player,
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

import {
  ErrorTransform
} from './errors';
import { UserFundedError } from '../types/errors';

// ENV values //
const wsURL: string = Config.GNO_WS_URL;
const rpcURL: string = Config.GNO_JSONRPC_URL;
const flippandoRealm: string = Config.GNO_FLIPPANDO_REALM;
const faucetURL: string = Config.FAUCET_URL;
const defaultGasWanted: Long = new Long(50_000_0);
const customTXFee = '200000ugnot'

const cleanUpRealmReturn = (ret: string) => {
  return ret.slice(2, -9).replace(/\\"/g, '"');
};
const decodeRealmResponse = (resp: string) => {
  return cleanUpRealmReturn(atob(resp));
};
const parsedJSONOrRaw = (data: string, nob64 = false) => {
  const decoded = nob64 ? cleanUpRealmReturn(data) : decodeRealmResponse(data);
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
  
  private constructor() {}

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
    //let mnemonic: string | null = localStorage.getItem(defaultMnemonicKey);
    let mnemonic = "cream normal drama winter dust ocean thing hurry raccoon vessel festival process";
    /*if (!mnemonic || mnemonic === '') {
      // Generate a fresh mnemonic
      mnemonic = generateMnemonic();

      // Save the mnemonic to local storage
      saveToLocalStorage(defaultMnemonicKey, mnemonic);
    }*/
    try {
      // Initialize the wallet using the saved mnemonic
      this.wallet = await GnoWallet.fromMnemonic(mnemonic);
      console.log(this.wallet);
      // Initialize the provider
      //this.provider = new GnoWSProvider(wsURL);
      this.providerJSON = new GnoJSONRPCProvider(rpcURL)
      console.log(this.providerJSON);
      // Connect the wallet to the provider
      this.wallet.connect(this.providerJSON);
    } catch (e) {
      //Should not happen
      console.error('Could not create wallet from mnemonic');
    }

    /*
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
          console.error('Could not fund user.');
        }
      }
    }*/
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
            `-pkgpath ${flippandoRealm} -gas-wanted ${gasWanted} -gas-fee ${defaultTxFee} ` +
            `-func ${method} ${gkArgs} test`
        );
      }
            
      const resp = (await this.wallet?.callMethod(
        flippandoRealm,
        method,
        args,
        TransactionEndpoint.BROADCAST_TX_COMMIT,
        undefined,
        {
          gasFee: customTXFee,
          gasWanted: gasWanted
        }
      )) as BroadcastTxCommitResult;
      if (gkLog) {
        console.info('response:', JSON.stringify(resp));
        const respData = resp.deliver_tx.ResponseBase.Data;
        if (respData !== null) {
          console.info('response (parsed):', parsedJSONOrRaw(respData));
        }
      }
      return resp;
    } 
    catch (err) {
      if(err !== undefined){
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
        console.log('error:', error);
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
        `$ gnokey query vm/qeval --data '${flippandoRealm}'$'\\n''${quotesEscaped}'`
      );
    }

    const resp = (await this.provider?.evaluateExpression(
      flippandoRealm,
      expr
    )) as string;

    if (gkLog) {
      console.info('response:', parsedJSONOrRaw(resp, true));
    }

    // Parse the response
    return resp;
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
    gameID: string,
    gameType: string,
    boardSize: string,
  ): Promise<any> {
    // Make the move
    const startNewGame = await this.callMethod('StartGame', [
      gameID,
      gameType,
      boardSize
    ]);
    console.log("actions startGame response ", JSON.stringify(startNewGame))
    return startNewGame;
  }

  /**
   * Checks if the given game is ongoing
   * @param gameID the ID of the running game
   */
  public async isGameOngoing(gameID: string) {
    // Fetch the game
    const game: Game = await this.getGame(gameID);

    return game.state === GameState.OPEN;
  }

  /**
   * Fetches the active game state. Should be called
   * within a loop and checked.
   * @param gameID the ID of the running game
   */
  public async getGame(gameID: string): Promise<Game> {
    const gameResponse: string = (await this.evaluateExpression(
      `GetGame("${gameID}")`
    )) as string;

    // Parse the response
    return JSON.parse(cleanUpRealmReturn(gameResponse));
  }

  /**
   * Executes the move and returns the game state
   * @param gameID the ID of the game
   * @param from from position
   * @param to  to position
   * @param promotion promotion information
   */
  async makeMove(
    gameID: string,
    from: string,
    to: string,
  ): Promise<Game> {
    // Make the move
    const moveResponse = await this.callMethod('MakeMove', [
      gameID,
      from,
      to
    ]);

    // Parse the response from the node
    const moveData = JSON.parse(
      decodeRealmResponse(moveResponse.deliver_tx.ResponseBase.Data as string)
    );
    if (!moveData) {
      throw new Error('invalid move response');
    }

    // Magically parse the response
    return moveData;
  }

  /**
   * Returns a flag indicating if the game with the specified ID is over
   * @param gameID the ID of the running game
   * @param type the game-over state types
   */
  async isGameOver(gameID: string, type: GameState): Promise<boolean> {
    // Fetch the game state
    const game: Game = await this.getGame(gameID);

    return game.state === type;
  }
  
  /****************
   * DASHBOARD
   ****************/

  /**
   * Fetches the current user player profile
   */
  async getUserData(): Promise<Player> {
    // Get the current player address
    const address: string = (await this.wallet?.getAddress()) as string;

    // Return the player data
    return this.getPlayer(address);
  }

  /**
   * Fetches the player score data
   * @param playerID the ID of the player (can be address or @username)
   */
  async getPlayer(playerID: string): Promise<Player> {
    const playerResponse: string = (await this.evaluateExpression(
      `GetPlayer("${playerID}")`
    )) as string;

    // Parse the response
    return JSON.parse(cleanUpRealmReturn(playerResponse));
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
   * Pings the faucet to fund the account before playing
   * @private
   */
  private async fundAccount(token: string): Promise<void> {
    // Prepare the request options
    console.log(token);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'faucet-token': token
      },
      body: JSON.stringify({
        to: await this.wallet?.getAddress()
      })
    };

    // Execute the request
    const fundResponse = await fetch(faucetURL, requestOptions);
    if (!fundResponse.ok) {
      throw constructFaucetError(await fundResponse.text());
    }
  }
}

export default Actions;