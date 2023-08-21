import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import goerli from '../src/config/testnet/goerli.js';
import mumbai from '../src/config/testnet/mumbai.js';
import polygonZkevm from '../src/config/testnet/polygon-zkevm.js';
import near from '../src/config/testnet/near';
import evmos from '../src/config/testnet/evmos.js';
import gnosis from '../src/config/testnet/gnosis.js';
import arbitrum from '../src/config/testnet/arbitrum.js';
import optimism from '../src/config/testnet/optimism.js';
import flippando from '../src/config/testnet/flippando.js';

export const setAddresses = createAsyncThunk(
  'flippando/setAddresses',
  async (args, thunkAPI) => {
    console.log('args ' + JSON.stringify(args, null, 2));
      try {
        if (args.network === 'goerli'){
          return goerli;
        }
        else if (args.network === 'mumbai'){
          return mumbai;
        }
        else if (args.network === 'polygon-zkevm'){
          return polygonZkevm;
        }
        else if (args.network === 'near'){
          return near;
        }
        else if (args.network === 'evmos'){
          return evmos;
        }
        else if (args.network === 'gnosis'){
          return gnosis;
        }
        else if (args.network === 'arbitrum'){
          return arbitrum;
        }
        else if (args.network === 'optimism'){
          return optimism;
        }
        else if (args.network === 'flippando'){
          return flippando;
        }
  
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
      state.artPayload = action.payload;
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

export const { setBlockchain, setNetwork, setArtPayload } = flippandoSlice.actions;

export default flippandoSlice;

