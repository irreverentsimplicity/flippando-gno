/* eslint-disable react/no-unknown-property */
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {setUserBalances, setUserBasicNFTs, setUserArtNFTs} from '../slices/flippandoSlice';
import GameLevels from "../components/GameLevels";
import TileImages from "../components/TileImages";
import Color1 from "./assets/squares/Color1.svg";
import Color14 from "./assets/squares/Color14.svg";
import Color9 from "./assets/squares/Color9.svg";
import Color5 from "./assets/squares/Color5.svg";
import Dice4 from "./assets/dice/4.svg";
import Dice3 from "./assets/dice/3.svg";
import Dice5 from "./assets/dice/5.svg";
import Dice6 from "./assets/dice/6.svg";
import Hexagram1 from "./assets/hexagrams/hexagram1.svg";
import Hexagram2 from "./assets/hexagrams/hexagram2.svg";
import Hexagram4 from "./assets/hexagrams/hexagram4.svg";
import Hexagram6 from "./assets/hexagrams/hexagram6.svg";
//import logo from "./assets/flippando-logo.jpg";
import SmallTile from "../components/SmallTile";
import Menu from "../components/Menu";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Actions from "../util/actions";

export default function Home() {
  
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
  const [testResponse, setTestResponse] = useState(null);
  const [flipBalance, setFlipBalance] = useState(0);
  const [lockedFlipBalance, setLockedFlipBalance] = useState(0);
  const gameTileTypes = ["squareGrid", "dice", "hexagrams"];
  const gameLevels = [16, 64];
  const [gameTileType, setGameTileType] = useState("squareGrid");
  const [gameLevel, setGameLevel] = useState(gameLevels[0]);
  const minNum = 1;
  const maxNum = 4;
  // levels boards, to be taken by querying player's NFTs
  const [level1Board, setLevel1Board] = useState(new Array(8).fill(0));
  const [level2Board, setLevel2Board] = useState(new Array(16).fill(0));
  //const [nfts, setNfts] = useState([]);
  const userBalances = useSelector(state => state.flippando.userBalances);
  const userBasicNFTs = useSelector(state => state.flippando.userBasicNFTs);

  const dispatch = useDispatch();


  useEffect( () => {
    getGNOTBalances();
    fetchUserNFTs();
  }, [userBasicNFTs])

  const fetchUserNFTs = async () => {
    let userNFTs = [];
    console.log("fetchUserNFTs");
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
      actions.getUserNFTs(playerAddress, "yes").then((response) => {
        console.log("getUserNFTS response in Flip", response);
        let parsedResponse = JSON.parse(response);
        console.log("parseResponse", JSON.stringify(response, null, 2))
        if(parsedResponse.userNFTs !== undefined && parsedResponse.userNFTs.length !== 0){  
           //setNfts(parsedResponse.userNFTs)
           dispatch(setUserBasicNFTs(parsedResponse.userNFTs))
           fetchUserFLIPBalances()
        }
      });
    } catch (err) {
      console.log("error in calling getUserNFTs", err);
    }
  };

  const getGNOTBalances = async () => {
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
      actions.getBalance().then((response) => {
        console.log("getGNOTBalances response in Flip", response);
        let parsedResponse = JSON.parse(response);
        console.log("parseResponse", JSON.stringify(parsedResponse, null, 2))
        if(parsedResponse === 0){
          actions.fundAccount("flippando")
        }
      });
    } catch (err) {
      console.log("error in calling getGNOTBalances", err);
    }
  }

  const fetchUserFLIPBalances = async () => {
    console.log("fetchUserFLIPBalances");
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
      actions.GetFLIPBalance(playerAddress).then((response) => {
        console.log("fetchUserFLIPBalances response in Flip", response);
        let parsedResponse = JSON.parse(response);
        console.log("parseResponse", JSON.stringify(response, null, 2))
        if(parsedResponse.lockedBalance !== undefined && parsedResponse.availableBalance !== undefined){  
           //setLockedFlipBalance(parsedResponse.lockedBalance)
           //setFlipBalance(parsedResponse.availableBalance)
           dispatch(setUserBalances(parsedResponse))
        }
      });
    } catch (err) {
      console.log("error in calling fetchUserFLIPBalances", err);
    }
  };

  const updateLevel1Board = () => {
    let newArray = [...level1Board]; 
    const zeroIndex = newArray.indexOf(0);
  
    if (zeroIndex !== -1) {
      newArray[zeroIndex] = 1;
    } else {
      newArray.push(1);
    }
  
    setLevel1Board(newArray);
  };

  async function createNewGame(gameLevel, typeOfGame) {
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
      actions.startGame(playerAddress, typeOfGame, gameLevel.toString()).then((response) => {
        console.log("response in Flip", response);
        let parsedResponse = JSON.parse(response);
        let newGameStatus = "Flippando initialized, game id: " + parsedResponse.id;
        setCurrentGameId(parsedResponse.id);
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

  async function flipTiles(withPositions){
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    const processedPositions = JSON.stringify(withPositions);
    
    try {
      actions.flipTiles(playerAddress, currentGameId, processedPositions).then((response) => {
        console.log("Game response in flip.js flipTiles", response);
        let parsedResponse = JSON.parse(response);
        console.log("parsedResponse", parsedResponse)
        
        // this is the blockchain solved matrix
        var tileMatrixCopy = parsedResponse.solvedGameBoard;
        // we get non-zero values from chain
        if (
          parsedResponse.gameBoard[withPositions[0]] ===
          parsedResponse.gameBoard[withPositions[1]] &&
          parsedResponse.gameBoard[withPositions[0]] !== 0 &&
          parsedResponse.gameBoard[withPositions[1]] !== 0
        ) {
          // this is the blockchain solved matrix
          setTileMatrix(parsedResponse.solvedGameBoard);
        }
        // we get zero values from chain, we're in quantum state, and
        // we don't have equal numbers, display quantum flickering visual
        else if (
          parsedResponse.gameBoard[withPositions[0]] ===
          parsedResponse.gameBoard[withPositions[1]] &&
          parsedResponse.gameBoard[withPositions[0]] === 0 &&
          parsedResponse.gameBoard[withPositions[1]] === 0
        ) {
          // add a timeout function, so the numbers are visible for a while
          tileMatrixCopy[withPositions[0]] = -2;
          tileMatrixCopy[withPositions[1]] = -2;
          setTileMatrix(tileMatrixCopy);

          // wait 2 secs, then update with the solved tile matrix
          setTimeout(() => {
            console.log("Delayed for 2 seconds.");
            var tileMatrixCopy1 = [...parsedResponse.solvedGameBoard];
            tileMatrixCopy1[withPositions[0]] = 0;
            tileMatrixCopy1[withPositions[1]] = 0;
            setTileMatrix(tileMatrixCopy1);
          }, 1000);
        } else {
          // add a timeout function, so the numbers are visible for a while
          tileMatrixCopy[withPositions[0]] =
          parsedResponse.gameBoard[withPositions[0]];
          tileMatrixCopy[withPositions[1]] =
          parsedResponse.gameBoard[withPositions[1]];
          setTileMatrix(tileMatrixCopy);

          // wait 2 secs, then update with the solved tile matrix
          setTimeout(() => {
            console.log("Delayed for 2 seconds.");
            var tileMatrixCopy1 = [...parsedResponse.solvedGameBoard];
            tileMatrixCopy1[withPositions[0]] = 0;
            tileMatrixCopy1[withPositions[1]] = 0;
            setTileMatrix(tileMatrixCopy1);
          }, 2000);
        }
        if(parsedResponse.gameStatus === "finished"){
          setGameStatus("Flippando solved, all tiles uncovered. Congrats!");
        }
      

      });
    } catch (err) {
      console.log("error in calling flipTiles", err);
    }
    
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
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
      actions.createNFT(playerAddress, gameId).then((response) => {
        console.log("mintNFT response in Flip", response);
        let parsedResponse = JSON.parse(response);
        console.log("parseResponse", parsedResponse)
        if(parsedResponse.error === undefined){
          setGameStatus("Board minted. Flippando is now in an undefined state.")
          updateLevel1Board()
          fetchUserNFTs()
          
        }
      });
    } catch (err) {
      console.log("error in calling mintNFT", err);
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
      if(userBasicNFTs !== undefined && userBasicNFTs.length !== 0) {
      //if (nfts.length !== 0) {
        for (i = 0; i < userBasicNFTs.length; i++) {
          levelsBoard[i] = userBasicNFTs[i];
        }
      }
    } else if (levels === 2) {
      levelsBoard = level2Board;
    }
    return levelsBoard.map((value, index) => {
      return (
        <span key={index} >
          {value === 0 && (
            <button disabled className={styles.card_small}></button>
          )}
          {/* we display a spinner while waiting for the nfts to load */}
          {value === 1 && (
            <button disabled className={styles.card_small_spinner}>
            <svg
              aria-hidden="true"
              className="animate-spin text-blue-200 dark:text-blue-600 fill-blue-600"
              style={{ width: '36x', height: '36px', marginLeft: '2px', marginRight: '2px' }} /* Adjust size */
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
          </button>
          )}
          {value !== 0 && userBasicNFTs.length !== 0 && (
            <SmallTile metadata={JSON.stringify(value)} />
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
                fill="white"
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
                fill="white"
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
                backgroundColor: "white",
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

  };

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

      <Header userBalances={userBalances} />
    
      <div className="grid flex grid-cols-5">
      
        <div className="bg-white-100">
        <Menu currentPage="/flip"/>
        </div>

        <div className="col-span-3 flex flex-col items-center pt-10">
          <div className="mb-4 w-full flex justify-end pr-20">
            
          </div>
          <div className="mb-4 text-sm text-gray-300">{gameStatus}</div>
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
          {gameStatus.includes("undefined") && (
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
                    createNewGame(gameLevel, gameTileType);
                  }}
                >
                  <button className="rounded-full bg-gray-200 px-3.5 py-2.5 text-lg hover:scale-110 font-semibold font-quantic text-black shadow-bg hover:bg-purple-900 hover:text-white border-none w-[160px] focus:outline-none">
                    Start a new flip                  
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
                    createNewGame(gameLevel, gameTileType);
                  }}
                >
                  <button className="rounded-md bg-gray-200 px-3.5 py-2.5 text-lg hover:scale-110 font-semibold font-quantic text-black shadow-bg hover:bg-green-700 hover:text-white border-none w-[160px] focus:outline-none">
                    Start a new flip                  
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

          
          <div className="col-span-3 flex flex-col items-center pt-10">
            {gameStatus.includes("undefined") && 
            (
            <div className="mb-4 w-full flex justify-center">
            {/*
            
            <p className="bold text-lg text-blue-800 pb-2 pt-4">Game type</p>
            Tiles:{" "}
            <GameLevels
              options={gameLevels}
              value={gameLevel}
              onChange={handleGameLevelChange}
            />
            */}
          
          
            {gameTileTypes.map((gameTypeChoice, index) => (
              <div key={index}>
                {gameTypeChoice === "squareGrid" && (
                  <a href="#" onClick={() => selectGameTileType(gameTypeChoice)}>
                    <div
                      className={`${
                        gameTileType === gameTypeChoice
                          ? "flex justify-center p-2 m-2 rounded-lg shadow-lg bg-gray-300"
                          : "flex justify-center p-2 m-2 rounded-lg bg-gray-100"
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <Color1 width={28} height={28} />
                        <Color5 width={28} height={28} />
                        <Color9 width={28} height={28} />
                        <Color14 width={28} height={28} />
                      </div>
                    </div>
                  </a>
                )}
                
                {gameTypeChoice === "dice" && (
                  <a href="#" onClick={() => selectGameTileType(gameTypeChoice)}>
                    <div
                      className={`${
                        gameTileType === gameTypeChoice
                          ? "flex justify-center p-2 m-2 rounded-lg shadow-lg bg-gray-300"
                          : "flex justify-center p-2 m-2 rounded-lg bg-gray-100"
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <Dice4 width={28} height={28} />
                        <Dice3 width={28} height={28} />
                        <Dice6 width={28} height={28} />
                        <Dice5 width={28} height={28} />
                      </div>
                    </div>
                  </a>
                )}
                {gameTypeChoice === "hexagrams" && (
                  <a href="#" onClick={() => selectGameTileType(gameTypeChoice)}>
                    <div
                      className={`${
                        gameTileType === gameTypeChoice
                          ? "flex justify-center p-2 m-2 rounded-lg shadow-lg bg-gray-300"
                          : "flex justify-center p-2 m-2 rounded-lg bg-gray-100"
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <Hexagram2 width={24} height={24} />
                        <Hexagram4 width={24} height={24} />
                        <Hexagram1 width={24} height={24} />
                        <Hexagram6 width={24} height={24} />
                      </div>
                    </div>
                  </a>
                )}
              </div>
            ))}
            </div>
          )}
        </div>
                  
        
        </div>
        {/* levels */}
        <div>
           <p className="bold text-lg pb-2 pt-4">Level 1</p>
            <div className="grid w-4/5 gap-y-2 gap-2 px-0 mx-0 pr-0 mr-0 grid-cols-4 grid-rows-2">
              {renderLevels(1)}
            </div>
            <p className="bold text-lg pb-2 pt-4">Level 2</p>
            <div className="grid w-4/5 gap-y-2 px-0 mx-0 pr-0 mr-0 grid-cols-4 grid-rows-4">
              {renderLevels(2)}
            </div>
          </div>
        </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        
        </div>
        {/**
        <div className="col-span-3">
          <h1>Ongoing games</h1>
        </div>
         */}
        

      
    </div>
  );
}
