import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
/*import goerli from '../src/config/testnet/goerli.js';
import mumbai from '../src/config/testnet/mumbai.js';
import polygonZkevm from '../src/config/testnet/polygon-zkevm.js';
import near from '../src/config/testnet/near';
import evmos from '../src/config/testnet/evmos.js';
import gnosis from '../src/config/testnet/gnosis.js';
import arbitrum from '../src/config/testnet/arbitrum.js';
import optimism from '../src/config/testnet/optimism.js';
import flippando from '../src/config/testnet/flippando.js';
*/
export const setAddresses = createAsyncThunk(
  'flippando/setAddresses',
  async (args, thunkAPI) => {
    console.log('args ' + JSON.stringify(args, null, 2));
      try {
       return("12345");
  
      } catch (error) {
        console.error('Error importing file:', error);
      }
    
  },
);

const flippandoSlice = createSlice({
  name: 'flippando',
  initialState: {
    blockchainName: undefined,
    testnet: true,
    mainnet: false,
    adr: {
      flippandoAddress: undefined,
      flipAddress: undefined,
      flippandoBundlerAddress: undefined,
      flippandoGameMasterAddress: undefined,
    },
    artPayload: [],
    userBalances: {},
    userGnotBalances: undefined,
    userBasicNFTs: [],
    userArtNFTs: [],
    networkSplit: [{near: 24}, 
      {evmos: 8}, 
      {mumbai: 12}, 
      {polygonZkevm: 12}, 
      {goerli: 5}, 
      {gnosis: 19}, 
      {arbitrum: 7}, 
      {optimism: 4},
      {kroma: 9},
    ],
  },
  reducers: {
    setBlockchain(state, action) {
      state.blockchainName = action.payload;
    },
    setArtPayload(state, action) {
      console.log("slice ", JSON.stringify(action.payload))
      state.artPayload = action.payload;
    },
    setUserBalances(state, action) {
      console.log("slice userBalances ", JSON.stringify(action.payload))
      state.userBalances = action.payload;
    },
    setUserGnotBalances(state, action) {
      console.log("slice userGnotBalances ", JSON.stringify(action.payload))
      state.userGnotBalances = action.payload;
    },
    setUserBasicNFTs(state, action) {
      console.log("slice userBasicNFTs ", JSON.stringify(action.payload))
      state.userBasicNFTs = action.payload;
    },
    setUserArtNFTs(state, action) {
      console.log("slice userArtNFTs ", JSON.stringify(action.payload))
      state.userArtNFTs = action.payload;
    },
    setNetwork(state, action) {
      if (action.payload === 'testnet'){
        state.testnet = true;
        state.mainnet = false;
      }
      else if (action.payload === 'mainnet'){
        state.testnet = false;
        state.mainnet = true;
      }
    },
  },
  extraReducers: {
    [setAddresses.pending]: (state, action) => {
      state.adr.flippandoAddress = undefined;
      state.adr.flipAddress = undefined;
      state.adr.flippandoBundlerAddress = undefined;
      state.adr.flippandoBundlerAddress = undefined;
    },
    [setAddresses.fulfilled]: (state, action) => {
      console.log('action.payload ' + JSON.stringify(action.payload, null, 2));
      const { flippandoAddress, flipAddress, flippandoBundlerAddress, flippandoGameMasterAddress } = action.payload;
      
      state.adr.flippandoAddress = flippandoAddress;
      state.adr.flipAddress = flipAddress;
      state.adr.flippandoBundlerAddress = flippandoBundlerAddress;
      state.adr.flippandoGameMasterAddress = flippandoGameMasterAddress;
    },
    [setAddresses.rejected]: (state, action) => {
      state.adr.flippandoAddress = undefined;
      state.adr.flipAddress = undefined;
      state.adr.flippandoBundlerAddress = undefined;
      state.adr.flippandoGameMasterAddress = undefined;
    },
  },
});

export const { setBlockchain, setNetwork, setArtPayload, setUserBalances, setUserGnotBalances, setUserBasicNFTs, setUserArtNFTs } = flippandoSlice.actions;

export default flippandoSlice;

