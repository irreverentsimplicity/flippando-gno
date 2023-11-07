/* pages/my-nfts.js */
//import {ethers} from 'ethers';
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import SmallTile from '../components/SmallTile';
import Canvas from '../components/Canvas';
import Grey from './assets/squares/grey.svg';
import Image from 'next/image';
import artNFT from './assets/artNFT.jpg';

export default function MyAssets() {
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);
  const [flipBalance, setFlipBalance] = useState(0);
  const [lockedFlipBalance, setLockedFlipBalance] = useState(0);

  const setCanvas = (boardWidth, boardHeight) => {
    setWidth(boardWidth);
    setHeight(boardHeight);
  }

  // test, to replace in prod with real board/canvas values and dragged NFTs into it
  async function makeArt(){
    console.log("makeArt")
   
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Flippando</title>
        <meta name="description" content="Entry point" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-cols-5 pb-20 justify-end">
        <div className="col-span-5 flex justify-end pr-10">
        <div className="rounded-md flex flex-col justify-center items-center mt-3 pl-3 pr-3 bg-gray-600">
          <button className="text-sm font-medium gap-6 font-quantic text-white border-transparent focus:outline-none">
            {flipBalance} liquid / {lockedFlipBalance + flipBalance} locked
            $FLIP
          </button>
        </div>
        </div>
      </div>
      
      <div className="grid flex grid-cols-5">
      
        <div className="bg-white-100 col-span-1">
        <Menu />
        </div>


    <div className="col-span-3">
      <div>
          <Canvas height={4} width={5}/>
      </div>
      <div  className="flex justify-center">
      <button 
        disabled={false}
        onClick={() => { makeArt() }} 
        className="bg-[#2A2F4F] hover:bg-black text-white font-bold py-2 px-4 mr-2 ml-2 rounded-full font-quantico">
          Make Art
      </button>
    </div>
    </div>

    </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        
        </div>
    </div>
  );
}
