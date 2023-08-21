# Deployment

At the moment of writing, the game is deployed on a chainlet inside Saga's Cassiopea (and a few other testnets, including Evmos and Polygon). 

Add Flippando chainlet to MetaMask:

Network name: Flippando
RPC Url: https://flippando-1684031009840269-1.jsonrpc.sp1.sagarpc.io
Chain Id: 1684031009840269
Currency symbol: FLIP
Block explorer: https://flippando-1684031009840269-1.sp1.sagaexplorer.io

The deployment consists of a pool of smart contracts and some basic UI. Make sure you added the testnets to MetaMask and get some testnet tokens from the testnet faucet. Refer to the specific testnet docs for that. In the current implementation each flip is a separate transaction that must be approved in MetaMask, but the gas fees are very low.

1. Clone the repo
2. Run `npm install`
2. Run `npm run dev`. This should start the UI on `localhost:3000`.
3. Play the game in the browser. It will require accepting transaction on Metamask. The game generation takes about 5-6 seconds and a normal game turn between 2 and 6-7 seconds. Best times are on Saga chainlet, closely followed by Evmos testnet and Polygon Mumbai.

# WARNING! Things can change very often in the codebase, so they may also break very often. Refer to this file for deployment / implementation changes.