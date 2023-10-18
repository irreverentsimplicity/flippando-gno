/* eslint-disable react/no-unknown-property */
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//import { ethers, utils } from 'ethers';
import GameLevels from "../components/GameLevels";
import TileImages from "../components/TileImages";
import Color1 from "./assets/squares/Color1.svg";
import Color3 from "./assets/squares/Color3.svg";
import Color9 from "./assets/squares/Color9.svg";
import Color5 from "./assets/squares/Color5.svg";
import Dice1 from "./assets/dice/1.svg";
import Dice3 from "./assets/dice/3.svg";
import Dice5 from "./assets/dice/5.svg";
import Dice6 from "./assets/dice/6.svg";
import Hexagram1 from "./assets/hexagrams/hexagram1.svg";
import Hexagram2 from "./assets/hexagrams/hexagram2.svg";
import Hexagram4 from "./assets/hexagrams/hexagram4.svg";
import Hexagram6 from "./assets/hexagrams/hexagram6.svg";
import SmallTile from "../components/SmallTile";
import Actions from "./util/actions";
//import Flippando from '../artifacts/contracts/Flippando.sol/Flippando.json'
//import Flip from '../artifacts/contracts/Flip.sol/Flip.json'

export default function Home() {
  //const adr = useSelector(state => state.flippando.adr);
  //const flippandoAddress = adr.flippandoAddress;
  //const flipAddress = adr.flipAddress;
  //const flippandoBundlerAddress = adr.flippandoBundlerAddress;
  //const flippandoGameMasterAddress = adr.flippandoGameMasterAddress;

  //console.log('adr' + JSON.stringify(adr, null, 2));
  const actions = Actions.getInstance();
  const [gnoAddress, setGnoAddress] = useState();
  const [positions, setPositions] = useState([]);
  const [remainingTiles, setRemainingTiles] = useState([]);
  const [cleanupEvent, setCleanupEvent] = useState(false);
  const [tileMatrix, setTileMatrix] = useState(Array(4 * 4).fill(0));
  const [uncoveredTileMatrix, setUncoveredTileMatrix] = useState(
    Array(4 * 4).fill(0)
  );
  const [gameStatus, setGameStatus] = useState(
    "Flippando is in an undefined state."
  );
  const [currentGameId, setCurrentGameId] = useState(null);
  const [flipBalance, setFlipBalance] = useState(0);
  const [testResponse, setTestResponse] = useState(null);
  const [lockedFlipBalance, setLockedFlipBalance] = useState(0);
  const gameTileTypes = ["squareGrid", "dice", "hexagrams"];
  const gameLevels = [16, 64];
  const [gameTileType, setGameTileType] = useState("squareGrid");
  const [gameLevel, setGameLevel] = useState(gameLevels[0]);
  const minNum = 1;
  const maxNum = 4;
  // levels boards, to be taken by querying player's NFTs
  const level1Board = new Array(8).fill(0);
  const level2Board = new Array(16).fill(0);

  const [nfts, setNfts] = useState([]);
  //console.log('nfts ' + JSON.stringify(nfts, null, 2));

  /*
  useEffect( () => {
    if (!window.adena) {
      window.open("https://adena.app/", "_blank");
    } else {
      adena.AddEstablish("Flippando");
    }
  })
  
  useEffect( () => {

    adena.GetAccount().then( (account) => {
      console.log('adena account', account);
      if(account.status === "success"){
        setGnoAddress(account.data.address);
      }
    })
  })*/

  /*
  useEffect(() => {
      fetchNFTs();
      fetchUserBalances();
  }, []);*/

  const fetchUserBalances = async () => {
    console.log("fetchUserBalances");
  };

  const fetchNFTs = async () => {
    console.log("fetchUserNFTs");
  };

  /* async function createNewGame(gameLevel, typeOfGame){
    console.log('gameLevel ' + gameLevel + ' typeOfGame ' + typeOfGame + ' gameTileType ' + gameTileType)
    if (gnoAddress !== undefined){
    
        adena.DoContract(
          {
            messages: [{
              type: "/vm.m_call",
              value: {
                caller: gnoAddress, // your Adena address
                send: "",
                pkg_path: "gno.land/r/demo/flippando", // Gnoland package path
                func: "StartGame", // Function name
                args: [ // Arguments
                  gnoAddress,
                  "someGameId",
                  "squareGrid",
                  "4"
                ]
              }
            }
          ], 
            gasFee: 1,
            gasWanted: 10000000
          }
        ).then( (gnoTx) => {
          console.log("gnoTx",gnoTx)
          adena.waitForTransaction(gnoTx.data.hash).then( (result) => {
            console.log(result);
          })
        })  
        /*
          contract.on("GameCreated", (gameId, game, sender) => {
            console.log("gameId: " + gameId + ", sender: " + sender)
            console.log("game data: " + JSON.stringify(game, null, 2));
            let newGameStatus = "Flippando game created, game id: " + gameId
            setCurrentGameId(gameId);
            setGameStatus(newGameStatus);
            })
    
            var gameType = 1; // default to normal games
            if (typeOfGame === 'sponsored') {
                gameType = 0;
            }
            //const game  = await contract.createGame(gameLevel, gameType, gameTileType);
            //console.log("game created " + JSON.stringify(game, 2, null));
        
            //console.log('error in createNewGame ' + JSON.stringify(error));
            //alert("We can't create this game now. That's all we know.")
            //setGameStatus('Flippando is in an undefined state.')
        
    }
  }*/

  async function createNewGame(gameLevel, typeOfGame) {
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
      actions.startGame(playerAddress, typeOfGame, gameLevel.toString()).then((response) => {
        console.log("response in Flip", response);
        let parsedResponse = JSON.parse(response);
        let newGameStatus = "Flippando initialized, game id: " + parsedResponse.id;
        setCurrentGameId(parsedResponse.GameId);
        setTileMatrix(Array(gameLevel).fill(0));
        setUncoveredTileMatrix(Array(gameLevel).fill(0));
        setGameStatus(newGameStatus);
      });
    } catch (err) {
      console.log("error in calling startGame", err);
    }
  }

  async function testBoard() {
    const actions = await Actions.getInstance();
    const solvedBoard = "[2,4,5,1,3,5,6,9,7,2,8,8,3,5,4,7]";
    const size = "4";
    try {
      actions.testBoard(solvedBoard, size).then((response) => {
        console.log("TestTile response in Flip", response);
        let parsedResponse = JSON.parse(response);
        console.log("parseResponse", parsedResponse)
        setTestResponse(parsedResponse);
      });
    } catch (err) {
      console.log("error in calling startGame", err);
    }
  }

  async function initializeGame(gameId) {
    setGameStatus("Assembling the board...");
    setPositions([]);
    console.log("gameId: " + gameId);
    const extractedGameId = parseInt(gameId.substring(40));
    if (flippandoGameMasterAddress !== undefined) {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const flippandoGameMasterContract = new ethers.Contract(
          flippandoGameMasterAddress,
          FlippandoGameMaster.abi,
          signer
        );
        const game = await flippandoGameMasterContract.initializeGame(
          extractedGameId
        );
        console.log(
          "result returned from FlippandoGameMaster.initializeGame()  " +
            JSON.stringify(game, 2, null)
        );

        const flippandoContract = new ethers.Contract(
          flippandoAddress,
          Flippando.abi,
          signer
        );
        //console.log('contract' + JSON.stringify(contract));
        flippandoContract.on("GameInitialized", (gameId, game, sender) => {
          console.log("gameId: " + gameId + ", sender: " + sender);
          console.log("game in Flippando: " + JSON.stringify(game));
          let newGameStatus = "Flippando initialized, game id: " + gameId;
          setGameStatus(newGameStatus);
          setTileMatrix(Array(gameLevel).fill(0));
          setUncoveredTileMatrix(Array(gameLevel).fill(0));
          setCurrentGameId(gameId);
        });
      } catch (error) {
        console.log("Error in initializeGame " + JSON.stringify(error));
        alert("We can't initialize this game now. That's all we know.");
        setGameStatus("Flippando is in an undefined state.");
      }
    }
  }

  async function flipTiles(withPositions){

  }
  async function playBlockchainGame(withPositions) {
    if (flippandoAddress !== undefined) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      //console.log("Account:", await signer.getAddress());
      //console.log("flippandoAddress " + JSON.stringify(flippandoAddress, 2, null));
      const contract = new ethers.Contract(
        flippandoAddress,
        Flippando.abi,
        signer
      );
      const startBlockNumber = await provider.getBlockNumber();
      provider.once("block", () => {
        contract.on(
          "GameState",
          (id, gameStruct, chainPositions, blockNumber) => {
            console.log("positions in event " + JSON.stringify(positions));
            if (blockNumber <= startBlockNumber) {
              console.log(
                "old event, blockNumber " +
                  blockNumber +
                  ", startBlockNumber " +
                  startBlockNumber
              );
              return;
            }
            console.log({
              id: id,
              gameStruct: JSON.stringify(gameStruct),
              chainPositions: JSON.stringify(chainPositions),
            });
            console.log("positions in chain " + chainPositions);
            // we check for positions in client to be the same as the positions in chain
            // otherwise we will go through all the events emitted and alter the react state
            // todo: how to get only the last event emitted
            if (
              positions[0] === chainPositions[0] &&
              positions[1] === chainPositions[1]
            ) {
              // this is the blockchain solved matrix
              var tileMatrixCopy = [...gameStruct[1]];
              // we get non-zero values from chain
              if (
                gameStruct[0][chainPositions[0]] ===
                  gameStruct[0][chainPositions[1]] &&
                gameStruct[0][chainPositions[0]] !== 0 &&
                gameStruct[0][chainPositions[1]] !== 0
              ) {
                // this is the blockchain solved matrix
                setTileMatrix(gameStruct[1]);
              }
              // we get zero values from chain, we're in quantum state, and
              // we don't have equal numbers, display quantum flickering visual
              else if (
                gameStruct[0][chainPositions[0]] ===
                  gameStruct[0][chainPositions[1]] &&
                gameStruct[0][chainPositions[0]] === 0 &&
                gameStruct[0][chainPositions[1]] === 0
              ) {
                // add a timeout function, so the numbers are visible for a while
                tileMatrixCopy[chainPositions[0]] = -2;
                tileMatrixCopy[chainPositions[1]] = -2;
                setTileMatrix(tileMatrixCopy);

                // wait 2 secs, then update with the solved tile matrix
                setTimeout(() => {
                  console.log("Delayed for 2 seconds.");
                  var tileMatrixCopy1 = [...gameStruct[1]];
                  tileMatrixCopy1[chainPositions[0]] = 0;
                  tileMatrixCopy1[chainPositions[1]] = 0;
                  setTileMatrix(tileMatrixCopy1);
                }, 1000);
              } else {
                // add a timeout function, so the numbers are visible for a while
                tileMatrixCopy[chainPositions[0]] =
                  gameStruct[0][chainPositions[0]];
                tileMatrixCopy[chainPositions[1]] =
                  gameStruct[0][chainPositions[1]];
                setTileMatrix(tileMatrixCopy);

                // wait 2 secs, then update with the solved tile matrix
                setTimeout(() => {
                  console.log("Delayed for 2 seconds.");
                  var tileMatrixCopy1 = [...gameStruct[1]];
                  tileMatrixCopy1[chainPositions[0]] = 0;
                  tileMatrixCopy1[chainPositions[1]] = 0;
                  setTileMatrix(tileMatrixCopy1);
                }, 2000);
              }
            }
            //setUncoveredTileMatrix(gameStruct[0]);
          }
        );

        contract.on("GameSolved", (id, gameStruct, blockNumber) => {
          console.log(
            "game solved gameStruct " + JSON.stringify(gameStruct, null, 2)
          );
          if (blockNumber <= startBlockNumber) {
            console.log(
              "old event, blockNumber " +
                blockNumber +
                ", startBlockNumber " +
                startBlockNumber
            );
            return;
          }
          setGameStatus("Flippando solved, all tiles uncovered. Congrats!");
        });
      });

      const txResponse = await contract
        .flip_tiles(currentGameId, withPositions)
        .then((result) => {
          console.log("txResponse " + JSON.stringify(result));
          result
            .wait()
            .then((result) =>
              console.log("wait result " + JSON.stringify(result))
            )
            .catch((error) => {
              console.log("error " + JSON.stringify(error));
              var tileMatrixCopy1 = [...tileMatrix];
              tileMatrixCopy1[positions[0]] = 0;
              tileMatrixCopy1[positions[1]] = 0;
              setTileMatrix(tileMatrixCopy1);
            });
        })
        .catch((error) => {
          console.log("error " + JSON.stringify(error));
          var tileMatrixCopy1 = [...tileMatrix];
          tileMatrixCopy1[positions[0]] = 0;
          tileMatrixCopy1[positions[1]] = 0;
          setTileMatrix(tileMatrixCopy1);
        });
    }
  }

  async function mintNFT(gameId) {
    if (flippandoAddress !== undefined) {
      console.log("gameId in mintNFT " + gameId);
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        flippandoAddress,
        Flippando.abi,
        signer
      );
      const startBlockNumber = await provider.getBlockNumber();
      provider.once("block", () => {
        contract.on("NFTCreated", (gameId, blockNumber) => {
          if (blockNumber <= startBlockNumber) {
            console.log(
              "old event, blockNumber " +
                blockNumber +
                ", startBlockNumber " +
                startBlockNumber
            );
            return;
          }
          console.log({
            gameId: gameId,
            blockNumber: blockNumber,
          });
        });
      });

      //const options = {value: ethers.utils.parseEther("0.001")};

      //const txResponse  = await contract.create_nft(gameId, { value: ethers.utils.parseEther('0.001') })
      const txResponse = await contract
        .create_nft(gameId)
        .then((result) => {
          console.log("mint txResponse " + JSON.stringify(result));
          result
            .wait()
            .then((result) => {
              console.log("wait result " + JSON.stringify(result));
              fetchNFTs();
              fetchUserBalances();
              setPositions([]);
            })
            .catch((error) => {
              console.log(
                "mint error after result " + JSON.stringify(error, null, 2)
              );
            });
        })
        .catch((error) => {
          console.log("mint error " + JSON.stringify(error, null, 2));
        });
    }
  }

  async function mintTestNFT() {
    if (flippandoAddress !== undefined) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        flippandoAddress,
        Flippando.abi,
        signer
      );
      const startBlockNumber = await provider.getBlockNumber();
      provider.once("block", () => {
        contract.on("NFTCreated", (gameId, blockNumber) => {
          if (blockNumber <= startBlockNumber) {
            console.log(
              "old event, blockNumber " +
                blockNumber +
                ", startBlockNumber " +
                startBlockNumber
            );
            return;
          }
          console.log({
            gameId: gameId,
            blockNumber: blockNumber,
          });
        });
      });
      //const options = {value: ethers.utils.parseEther("0.001")};

      // values: "squareGrid", "dice", "hexagrams"
      const gasLimit = ethers.BigNumber.from("40000000");
      const txResponse = await contract
        .create_test_nft("dice", {
          gasLimit: gasLimit,
        })
        .then((result) => {
          console.log("mint test txResponse " + JSON.stringify(result));
          result
            .wait()
            .then((result) => {
              console.log("wait test result " + JSON.stringify(result));
              fetchNFTs();
              fetchUserBalances();
            })
            .catch((error) => {
              console.log(
                "mint test error after result " + JSON.stringify(error, null, 2)
              );
            });
        })
        .catch((error) => {
          console.log("mint test error " + JSON.stringify(error, null, 2));
        });
    }
  }

  async function mintSingleTestNFT() {
    if (flippandoAddress !== undefined) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        flippandoAddress,
        Flippando.abi,
        signer
      );
      const startBlockNumber = await provider.getBlockNumber();
      provider.once("block", () => {
        contract.on("NFTCreated", (gameId, blockNumber) => {
          if (blockNumber <= startBlockNumber) {
            console.log(
              "old event, blockNumber " +
                blockNumber +
                ", startBlockNumber " +
                startBlockNumber
            );
            return;
          }
          console.log({
            gameId: gameId,
            blockNumber: blockNumber,
          });
        });
      });
      //const options = {value: ethers.utils.parseEther("0.001")};

      // values: "squareGrid", "dice", "hexagrams"
      const gasLimit = ethers.BigNumber.from("40000000");
      const txResponse = await contract
        .create_single_test_nft(gameTileType)
        .then((result) => {
          console.log("mint test txResponse " + JSON.stringify(result));
          result
            .wait()
            .then((result) => {
              console.log("wait test result " + JSON.stringify(result));
              fetchNFTs();
              fetchUserBalances();
            })
            .catch((error) => {
              console.log(
                "mint test error after result " + JSON.stringify(error, null, 2)
              );
            });
        })
        .catch((error) => {
          console.log("mint test error " + JSON.stringify(error, null, 2));
        });
    }
  }

  // pure react code
  const playGame = (atPosition) => {
    //console.log("position.length " + positions.length)

    if (positions.length !== 0) {
      //console.log("trieggered if")
      if (positions.length === 1) {
        // we have one inside, we add the other one and trigger game mechanic
        var positionsArray = positions;
        positionsArray.push(atPosition);

        // game mechanic
        // we don't process tapping on the same value

        if (positionsArray[0] !== positionsArray[1]) {
          flipTiles(positionsArray)
          //playBlockchainGame(positionsArray);
          
          var tileMatrixCopy = [...tileMatrix];
          var tmpTileMatrixCopy = [...tileMatrix];
          var uncoveredTileMatrixCopy = [...uncoveredTileMatrix];

          // setting the client numbers to -1, while waiting for the chain generated
          // numbers
          var randomNumber1 = -1;
          var randomNumber2 = -1;

          let tile1 = uncoveredTileMatrixCopy[positionsArray[0]];
          let tile2 = uncoveredTileMatrixCopy[positionsArray[1]];
          if (tile1 !== 0 && tile1 !== -1) {
            randomNumber1 = tile1;
          }
          if (tile2 !== 0 && tile2 !== -1) {
            randomNumber2 = tile2;
          }

          // different numbers, add them to the uncoveredTileMatrix
          if (randomNumber1 !== randomNumber2) {
            uncoveredTileMatrixCopy[positionsArray[0]] = randomNumber1;
            uncoveredTileMatrixCopy[positionsArray[1]] = randomNumber2;
            // if we don't have a cleanup event, we save the numbers in the uncovered matrix
            if (!cleanupEvent) {
              setUncoveredTileMatrix(uncoveredTileMatrixCopy);
            }

            // we add them to the tmpTileMatrixCopy, in order to display them briefly
            tmpTileMatrixCopy[positionsArray[0]] = randomNumber1;
            tmpTileMatrixCopy[positionsArray[1]] = randomNumber2;
            setTileMatrix(tmpTileMatrixCopy);

            // wait 2 secs, then update with the solved tile matrix
            setTimeout(() => {
              console.log("Delayed for 2 seconds.");
              tileMatrixCopy[positionsArray[0]] = 0;
              tileMatrixCopy[positionsArray[1]] = 0;
              //console.log("tileMatrixCopy after reset" + tileMatrixCopy)
              // if we have a cleanup event, we don't save the numbers in the uncovered matrix
              if (cleanupEvent) {
                setUncoveredTileMatrix(tileMatrixCopy);
              }
              setTileMatrix(tileMatrixCopy);
            }, 500);
          } else {
            // numbers are identical, update the board
            tileMatrixCopy[positionsArray[0]] = randomNumber1;
            tileMatrixCopy[positionsArray[1]] = randomNumber2;
            uncoveredTileMatrixCopy[positionsArray[0]] = randomNumber1;
            uncoveredTileMatrixCopy[positionsArray[1]] = randomNumber2;
            setUncoveredTileMatrix(uncoveredTileMatrixCopy);
            setTileMatrix(tileMatrixCopy);
          }

          console.log("tileMatrixCopy after turn" + tileMatrixCopy);
          console.log(
            "uncoveredTileMatrixCopy after turn" + uncoveredTileMatrixCopy
          );
          // get the remaining number of unsolved tiles

          var totalUnsolvedTiles = tileMatrixCopy.filter((x) => x <= 0).length;
          let currentSolvedTiles = tileMatrixCopy.filter((x) => x > 0).length;
          var totalUncoveredTiles = totalUnsolvedTiles;
          //let currentSolvedTiles = tileMatrixCopy.length - totalUnsolvedTiles
          console.log(
            "tileMatrixCopy.length after turn " + tileMatrixCopy.length
          );
          console.log("totalUnsolvedTiles after turn " + totalUnsolvedTiles);
          console.log("totalUncoveredTiles after turn " + totalUncoveredTiles);
          console.log("solvedTiles after turn " + currentSolvedTiles);
          if (tileMatrixCopy.length - currentSolvedTiles > maxNum) {
            setGameStatus("Flippando deployed, id: " + currentGameId);
          } else if (tileMatrixCopy.length - currentSolvedTiles != 0) {
            // we may or may not reset the last tiles
            setGameStatus(
              "Flippando is heating, entering unstable quantum state!"
            );
            // we need to check if there are duplicates in the uncovered array
            // if there are, we don't set the cleanup event true, it means the matrix can uncover at least
            // one more tile
            // if there aren't, we set the cleanup event to true, because the matrix is not solvable
            // so we need to reset to zero those tiles and re-generate random numbers
            setCleanupEvent(true);
          } else if (currentSolvedTiles === tileMatrixCopy.length) {
            // we solved everything
            setGameStatus("Flippando solved, all tiles uncovered. Congrats!");
          }
          // we reset
          setPositions([]);
        } else {
          setPositions([]);
        }
      }
    } else {
      console.log("adding the first position");
      var positionsArray = positions;
      positionsArray.push(atPosition);
      setPositions(positionsArray);
    }
    console.log(
      "atPosition " + atPosition + ", positions " + JSON.stringify(positions)
    );
  };

  const getTilenumber = () => {
    var min = Math.ceil(minNum);
    var max = Math.floor(maxNum);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const renderLevels = (levels) => {
    let levelsBoard = [];
    let i = 0;
    if (levels === 1) {
      levelsBoard = level1Board;
      if (nfts.length !== 0) {
        for (i = 0; i < nfts.length; i++) {
          levelsBoard[i] = nfts[i];
        }
      }
    } else if (levels === 2) {
      levelsBoard = level2Board;
    }
    return levelsBoard.map((value, index) => {
      return (
        <span key={index}>
          {value === 0 && (
            <button disabled className={styles.card_small}></button>
          )}
          {value !== 0 && nfts.length !== 0 && (
            <SmallTile metadata={JSON.stringify(value.metadata)} />
          )}
        </span>
      );
    });
  };

  const renderBoard = () => {
    //var tileMatrix = Array(4 * 4).fill(0);
    //console.log("positions in renderBoard " + JSON.stringify(positions))
    console.log("gameLevel " + gameLevel);
    return tileMatrix.map((value, index) => {
      const TileImage =
        value === -1 || value === -2 || value === 0
          ? "div"
          : gameTileType === "squareGrid"
          ? TileImages[value - 1].squareTile
          : gameTileType === "dice"
          ? TileImages[value - 1].diceTile
          : gameTileType === "hexagrams"
          ? TileImages[value - 1].hexagramTile
          : null;

      const tileProps = {
        width: "100",
        height: "100",
      };

      const tilePropsBigBoard = {
        width: "50",
        height: "50",
      };

      return (
        <span
          key={index}
          className={
            gameLevel == 16 ? styles.empty_div : styles.empty_div_big_board
          }
        >
          {value === -1 && (
            <div
              role="status"
              className={
                gameLevel == 16 ? styles.empty_div : styles.empty_div_big_board
              }
            >
              <svg
                aria-hidden="true"
                className="mr-4 ml-4 mb-4 mt-4 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {value === -2 && (
            <div
              role="status"
              className={
                gameLevel == 16 ? styles.empty_div : styles.empty_div_big_board
              }
            >
              <svg
                aria-hidden="true"
                className="mr-4 ml-4 mb-4 mt-4 text-red-200 animate-pulse dark:text-red-600 fill-red-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {value !== -1 && value !== -2 && value !== 0 && (
            <div
              className={
                gameLevel == 16
                  ? styles.game_tile_image
                  : styles.game_tile_image_big_board
              }
              style={{
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            >
              {gameLevel == 16 && <TileImage {...tileProps} />}
              {gameLevel == 64 && <TileImage {...tilePropsBigBoard} />}
            </div>
          )}
          {value === 0 && positions.includes(index) && (
            <button
              disabled
              onClick={() => {
                playGame(index);
                console.log("you clicked " + JSON.stringify(index));
              }}
              className={gameLevel == 16 ? styles.card : styles.card_big_board}
            ></button>
          )}
          {value === 0 && !positions.includes(index) && (
            <button
              onClick={() => {
                playGame(index);
                console.log("you clicked " + JSON.stringify(index));
              }}
              className={gameLevel == 16 ? styles.card : styles.card_big_board}
            ></button>
          )}
        </span>
      );
    });

    /*
    return tileMatrix.map( (value, index) => {
        const colorComponent = `Color${value} width="100" height="100"`;
        const diceComponent = `Dice${value} width="100" height="100"`;
        const hexagramComponent = `Hexagram${value} width="100" height="100"`;
        return(
          <span key={index} className={styles.empty_div}>

            {value === -1 && 
              <div role="status" className={styles.empty_div}>
              <svg aria-hidden="true" className="mr-4 ml-4 mb-4 mt-4 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
              </div>
            }
            {value === -2 && 
              <div role="status" className={styles.empty_div}>
              <svg aria-hidden="true" className="mr-4 ml-4 mb-4 mt-4 text-red-200 animate-pulse dark:text-red-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
              </div>
            }
            {value !== -1 && value !== -2 && value !== 0 && 
              <div className={styles.game_tile_image} style={{
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
            }} >
              {gameTileType == "squareGrid" && {colorComponent} }
              {gameTileType == "dice" && {diceComponent} }
              {gameTileType == "hexagrams" && {hexagramComponent} }
              </div>
            }
            {(value === 0 && positions.includes(index)) &&
              <button 
                disabled
                onClick={() => {
                  playGame(index)
                  console.log("you clicked " + JSON.stringify(index))
                  }
                } 
                  className={styles.card}>
              </button>
            }
            {(value === 0 && !positions.includes(index)) &&
              <button 
                onClick={() => {
                  playGame(index)
                  console.log("you clicked " + JSON.stringify(index))
                  }
                } 
                  className={styles.card}>
              </button>
            }
          </span>
        )
    })*/
  };

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const selectGameTileType = (selectedGameTileType) => {
    if (
      gameStatus.includes("Flippando initialized") ||
      gameStatus.includes("Flippando deployed") ||
      gameStatus.includes("Flippando is heating")
    ) {
      alert(
        "Can't change game type in a middle of a game. Reload if you want to start over."
      );
    } else {
      console.log(selectedGameTileType);
      setGameTileType(selectedGameTileType);
    }
  };

  const handleGameLevelChange = (selectedValue) => {
    setGameLevel(selectedValue);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Flippando</title>
        <meta name="description" content="Entry point" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid flex grid-cols-5">
        <div className="bg-white-100">
          <p className="bold text-lg text-blue-800 pb-2 pt-4">Level 1</p>
          <div className="grid w-4/5 gap-y-2 gap-2 px-0 mx-0 pr-0 mr-0 grid-cols-4 grid-rows-2">
            {renderLevels(1)}
          </div>
          <p className="bold text-lg text-blue-800 pb-2 pt-4">Level 2</p>
          <div className="grid w-4/5 gap-y-2 px-0 mx-0 pr-0 mr-0 grid-cols-4 grid-rows-4">
            {renderLevels(2)}
          </div>
        </div>

        <div className="col-span-3 flex flex-col items-center pt-10">
          <div className="mb-4 w-full flex justify-end pr-20">
            <div className="rounded-md flex flex-col justify-start items-start">
              <button className="text-lg font-bold gap-6 font-quantic border-transparent focus:outline-none">
                {flipBalance} liquid / {lockedFlipBalance + flipBalance} locked
                $FLIP
              </button>
            </div>
          </div>
          <div className="mb-4">{gameStatus}</div>
          {gameStatus === "Initializing..." && (
            <div role="status" className={styles.empty_div}>
              <svg
                aria-hidden="true"
                className="mr-4 ml-4 mb-4 mt-4 text-blue-200 animate-spin dark:text-blue-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Inititalizing new game...</span>
            </div>
          )}
          {gameStatus === "Flippando is in an undefined state." && (
            <div className="flex gap-6">
              {/** 
                 <div>
                    <a href="#" onClick={() => { createNewGame(gameLevel, 'sponsored') }} >
                    <button className='rounded-md bg-[#47A992] px-3.5 py-2.5 hover:scale-110 text-lg font-quantic font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-none w-[140px] focus:outline-none'>Sponsored <p>Game</p> </button>
                    </a>
                </div>
                */}
              <div>
                <a
                  href="#"
                  onClick={() => {
                    createNewGame(gameLevel, "normal");
                  }}
                >
                  <button className="rounded-md bg-[#98D0E9] px-3.5 py-2.5 text-lg hover:scale-110 font-semibold font-quantic text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-none w-[140px] focus:outline-none">
                    Initialize<p>new game</p>{" "}
                  </button>
                </a>
              </div>
            </div>
          )}
          {gameStatus.includes("Flippando game created") && (
            <div>
              <a
                href="#"
                onClick={() => {
                  initializeGame(currentGameId);
                }}
              >
                <button className="rounded-md bg-[#98D0E9] px-3.5 py-2.5 text-lg hover:scale-110 font-semibold font-quantic text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-none w-[140px] focus:outline-none">
                  Play <p>this game</p>
                </button>
              </a>
            </div>
          )}
          {(gameStatus.includes("Flippando initialized") ||
            gameStatus.includes("Flippando deployed") ||
            gameStatus.includes("Flippando is heating") ||
            gameStatus.includes("Flippando solved")) && (
            <div
              className={
                gameLevel == 16
                  ? "grid gap-x-0 gap-y-1 grid-cols-4"
                  : "grid gap-x-0 gap-y-1 grid-cols-8"
              }
            >
              {renderBoard()}
            </div>
          )}
          {gameStatus.includes("Flippando solved") && (
            <div>
              <div className={styles.mintButton}>
                <button
                  onClick={() => {
                    mintNFT(currentGameId);
                  }}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2 ml-2 rounded-full"
                >
                  Mint this NFT
                </button>
              </div>
              {/** 
              <div>
              <a href="#" onClick={() => { createNewGame(gameLevel, 'sponsored') }} >
                    <button className='rounded-md bg-[#47A992] px-3.5 py-2.5 hover:scale-110 text-lg font-quantic font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-none w-[140px] focus:outline-none'>Sponsored <p>Game</p> </button>
                    </a>
                </div>
                 */}
              <div>
                <a
                  href="#"
                  onClick={() => {
                    createNewGame(gameLevel, "normal");
                  }}
                >
                  <button className="rounded-md bg-[#98D0E9] px-3.5 py-2.5 text-lg hover:scale-110 font-semibold font-quantic text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-none w-[140px] focus:outline-none">
                    Initialize<p> new game</p>{" "}
                  </button>
                </a>
              </div>
            </div>
          )}

          <div>
            {/* 
            <div>
                
            <div className={styles.mintButton}>
                <button 
                onClick={() => { mintTestNFT() }} 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2 ml-2 rounded-full">
                  Mint test NFTs
              </button>
            </div>
            
            <div className={styles.mintButton}>
                <button 
                onClick={() => { mintSingleTestNFT() }} 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2 ml-2 rounded-full">
                  Mint single test NFT
              </button>
            </div>
            
            <div>
                <a href="#" onClick={() => testBoard()} >
                  <svg width="150" height="150">
                    <circle cx="75" cy="75" r="75" fill="red" />
                    <text x="75" y="75" textAnchor="middle" dominantBaseline="central" fill="white">Test SVG</text>
                  </svg>
                </a>
              </div>             
            */}
            {/*testResponse !== null &&
              <div>
                <img src={"data:image/svg+xml;base64," + testResponse.svgData}/>
                </div>
          */}
            
        
          </div>
        </div>
        <div className="bg-white-100">
          <p className="bold text-lg text-blue-800 pb-2 pt-4">Game type</p>
          Tiles:{" "}
          <GameLevels
            options={gameLevels}
            value={gameLevel}
            onChange={handleGameLevelChange}
          />
          {gameTileTypes.map((gameTypeChoice, index) => (
            <div key={index}>
              {gameTypeChoice === "squareGrid" && (
                <a href="#" onClick={() => selectGameTileType(gameTypeChoice)}>
                  <div
                    className={`${
                      gameTileType === gameTypeChoice
                        ? "flex justify-center p-4 m-4 rounded-lg shadow-lg bg-gray-200"
                        : "flex justify-center p-4 m-4 rounded-lg bg-gray-100"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Color1 width={50} height={50} />
                      <Color5 width={50} height={50} />
                      <Color9 width={50} height={50} />
                      <Color3 width={50} height={50} />
                    </div>
                  </div>
                </a>
              )}
              <hr />
              {gameTypeChoice === "dice" && (
                <a href="#" onClick={() => selectGameTileType(gameTypeChoice)}>
                  <div
                    className={`${
                      gameTileType === gameTypeChoice
                        ? "flex justify-center p-4 m-4 rounded-lg shadow-lg bg-gray-200"
                        : "flex justify-center p-4 m-4 rounded-lg bg-gray-100"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Dice1 width={50} height={50} />
                      <Dice3 width={50} height={50} />
                      <Dice6 width={50} height={50} />
                      <Dice5 width={50} height={50} />
                    </div>
                  </div>
                </a>
              )}
              {gameTypeChoice === "hexagrams" && (
                <a href="#" onClick={() => selectGameTileType(gameTypeChoice)}>
                  <div
                    className={`${
                      gameTileType === gameTypeChoice
                        ? "flex justify-center p-4 m-4 rounded-lg shadow-lg bg-gray-200"
                        : "flex justify-center p-4 m-4 rounded-lg bg-gray-100"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Hexagram2 width={50} height={50} />
                      <Hexagram4 width={50} height={50} />
                      <Hexagram1 width={50} height={50} />
                      <Hexagram6 width={50} height={50} />
                    </div>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="col-span-5">
          <footer className={styles.footer}></footer>
        </div>
      </div>
    </div>
  );
}
