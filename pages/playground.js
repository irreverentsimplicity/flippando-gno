/* pages/my-nfts.js */
import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import SmallTile from '../components/SmallTile';
import Canvas from '../components/Canvas';
import Grey from './assets/squares/grey.svg';
import Image from 'next/image';
import artNFT from './assets/artNFT.jpg';
import Flippando from '../artifacts/contracts/Flippando.sol/Flippando.json'
import FlippandoBundler from '../artifacts/contracts/FlippandoBundler.sol/FlippandoBundler.json'

export default function MyAssets() {
  const adr = useSelector(state => state.flippando.adr);
  const artPayload = useSelector(state => state.flippando.artPayload);
  const flippandoAddress = adr.flippandoAddress;
  const flippandoBundlerAddress = adr.flippandoBundlerAddress;
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);

  const setCanvas = (boardWidth, boardHeight) => {
    setWidth(boardWidth);
    setHeight(boardHeight);
  }

  // test, to replace in prod with real board/canvas values and dragged NFTs into it
  async function makeArt(){

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
  
    const flippandoContract = new ethers.Contract(flippandoAddress, Flippando.abi, signer);
    const flippandobundlerContract = new ethers.Contract(flippandoBundlerAddress, FlippandoBundler.abi, signer);

    const startBlockNumber = await provider.getBlockNumber();
    provider.once("block", () => {
      flippandoContract.on("ArtworkCreated", (artefact, blockNumber) => {
        if (blockNumber <= startBlockNumber) {
          console.log("old event, blockNumber " + blockNumber + ", startBlockNumber " + startBlockNumber);
          return;
        }
        console.log({
          Artwork: JSON.stringify(artefact, null, 2),
        })
      })
    })

    const txResponse  = await flippandoContract.makeArt(2,2,[1,3,2,4])
    .then( (result) => 
      { 
        console.log('make art txResponse ' + JSON.stringify(result))
        result.wait()
        .then( (result) => {
          console.log('wait test result ' + JSON.stringify(result))
            fetchNFTs();
        })
        .catch(error => { 
          console.log('make art error after result ' + JSON.stringify(error, null, 2))
        })
      })
    .catch(error => { 
      console.log('make art error ' + JSON.stringify(error, null, 2))
    })

  }

  return (
    <div>
      <div>
          <Canvas height={4} width={5}/>
      </div>
      <div  className="flex justify-center">
      <button 
        disabled={artPayload.length === 0}
        onClick={() => { makeArt() }} 
        className="bg-[#2A2F4F] hover:bg-black text-white font-bold py-2 px-4 mr-2 ml-2 rounded-full font-quantico">
          Make Art
      </button>
    </div>
    </div>
  );
}
