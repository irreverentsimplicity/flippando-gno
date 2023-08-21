// store/reducers/index.js
import { combineReducers } from 'redux';
import flippandoReducer from './flippandoSlice';

const rootReducer = combineReducers({
  flippando: flippandoReducer,
});

export default rootReducer;

