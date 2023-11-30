/* pages/my-nfts.js */
//import {ethers} from 'ethers';
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { Box, Text } from "@chakra-ui/react";
import { useSelector } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import SmallTile from '../components/SmallTile';
import Canvas from '../components/Canvas';
import Wallet from "../components/Wallet";
import Grey from './assets/squares/grey.svg';
import Image from 'next/image';
import artNFT from './assets/artNFT.jpg';
import Actions from "./util/actions";

export default function Playground() {
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);
  const userBalances = useSelector(state => state.flippando.userBalances);
  
  const artPayload = useSelector(state => state.flippando.artPayload);


  async function makeArt(){
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    const height = artPayload[0]
    const width = artPayload[1]
    
    
    const bTokenIDs = JSON.stringify(artPayload[2], (key, value) => 
      (key === '' ? value : parseInt(value))
    );
    console.log("makeArt, ", JSON.stringify(artPayload))
    if (artPayload.length === 0){
      alert("You have to fill the entire canvas")
    }
    if (artPayload.length !== 0){
      
      try {
        actions.createCompositeNFT(playerAddress, String(width), String(height), bTokenIDs).then((response) => {
          console.log("createCompositeNFT response in Playground", response);
          let parsedResponse = JSON.parse(response);
          console.log("createCompositeNFT parseResponse", parsedResponse)
        });
      } catch (err) {
        console.log("error in calling createCompositeNFT", err);
      }
    } 
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Flippando</title>
        <meta name="description" content="Entry point" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wallet userBalances={userBalances} />
      
      <div className="grid flex grid-cols-5">
      
        <div className="bg-white-100 col-span-1">
        <Menu />
        </div>


    <div className="col-span-4">
    <Box className="justify-end" borderBottom="1px solid white" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" textAlign="right" mb={4} mr={4}>
            Playground
          </Text>
        </Box>
      <div>
          <Canvas height={3} width={3}/>
      </div>
      <div  className="flex justify-center">
      <button 
        disabled={false}
        onClick={() => { makeArt() }} 
        className="bg-gray-200 hover:bg-purple-900 hover:text-white text-black text-lg font-bold py-2 px-4 mr-2 ml-2 rounded-full font-quantico">
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
