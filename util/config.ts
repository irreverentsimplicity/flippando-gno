import dotenv from 'dotenv';

dotenv.config();

const {
  GNO_WS_URL,
  GNO_JSONRPC_URL,
  GNO_FLIPPANDO_REALM,
  FAUCET_URL
} = process.env;

if (!GNO_WS_URL) {
  throw Error('GNO_WS_URL property not found in .env');
}

if (!GNO_JSONRPC_URL) {
  throw Error('GNO_JSONRPC_URL property not found in .env');
}

if (!GNO_FLIPPANDO_REALM) {
  throw Error('GNO_FLIPPANDO_REALM property not found in .env');
}

if (!FAUCET_URL) {
  throw Error('FAUCET_URL property not found in .env');
}

export default {
  GNO_WS_URL,
  GNO_JSONRPC_URL,
  GNO_FLIPPANDO_REALM,
  FAUCET_URL
};
