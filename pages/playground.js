/* pages/my-nfts.js */
//import {ethers} from 'ethers';
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Box, Text, VStack, Button } from "@chakra-ui/react";
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import SmallTile from '../components/SmallTile';
import Canvas from '../components/Canvas';
import Header from "../components/Header";
import Grey from './assets/squares/grey.svg';
import Image from 'next/image';
import artNFT from './assets/artNFT.jpg';
import Actions from "../util/actions";
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";

export default function Playground() {
  const [width, setWidth] = useState(2); // defaults, changed on calling setExistingBasicNFTs
  const [height, setHeight] = useState(2); // defaults, changed on calling setExistingBasicNFTs
  const [existingBasicNFTs, setExistingBasicNFTs] = useState(0);
  const userBalances = useSelector(state => state.flippando.userBalances);
  const userGnotBalances = useSelector(state => state.flippando.userGnotBalances);
  const [isArtMinted, setIsArtMinted] = useState(false)
  const artPayload = useSelector(state => state.flippando.artPayload);

  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);

  const dispatch = useDispatch()
  
  useEffect( () => {
      console.log("rpcEndpoint in useEffect, market.js ", rpcEndpoint)
      getGNOTBalances(dispatch);
      fetchUserFLIPBalances(dispatch);
  }, [rpcEndpoint])

  // fetch all existing basic NFTs, used for setting the playground size
  useEffect(() => {
    console.log("fetch all existing basic NFTs")
    const fetchNFTs = async () => {
      const actions = await Actions.getInstance();
      
      try {
        actions.getAllNFTs("").then((response) => {
          console.log("fetch all existing basic NFTs response in playground.js", response);
          let parsedResponse = JSON.parse(response);
          console.log("parseResponse", parsedResponse)
          if(parsedResponse.userNFTs !== undefined && parsedResponse.userNFTs.length !== 0){
              let existingNFTs = 0
              parsedResponse.userNFTs.map((nftItem) => {
                existingNFTs++;
              })
            
            if(existingNFTs !== 0){
              setExistingBasicNFTs(existingNFTs);
              console.log(existingNFTs)
              if(existingNFTs <= 50){
                setHeight(2);
                setWidth(2);
              }
              else if(existingNFTs > 50 && existingNFTs <= 100){
                setHeight(3);
                setWidth(3);
              }
              else if(existingNFTs > 100 && existingNFTs <= 400){
                setHeight(4);
                setWidth(4);
              }
              else if(existingNFTs > 400 && existingNFTs <= 600){
                setHeight(5);
                setWidth(5);
              }
              else if(existingNFTs > 600 && existingNFTs <= 800){
                setHeight(6);
                setWidth(6);
              }
              else if(existingNFTs > 800 && existingNFTs <= 1000){
                setHeight(7);
                setWidth(7);
              }
              else if(existingNFTs > 1000){
                setHeight(8);
                setWidth(8);
              }
            }
            
          }
        });
      } catch (err) {
        console.log("error in calling fetch all existing basic NFTs", err);
      }
      
    };

    fetchNFTs();;
  }, []);

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
          if(parsedResponse.error === undefined){
            setIsArtMinted(true)
          }
        });
      } catch (err) {
        console.log("error in calling createCompositeNFT", err);
      }
    } 
  }

  return (
    <div className={styles.container}>
      
      <Header userBalances={userBalances} userGnotBalances={userGnotBalances}/>
      
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
        {
          /* get height and width dynamically from backend, based on the logic implemented
          in CreateCompositeNFT: 50 / 2 x 2 - 100 / 3 x 3 - 400 / 4 x 4 - 600 / 5 x 5 - 800 / 6 x 6 - 1000 / 7 x 7 - 1200 / 8 x 8 
          */
        }
          <Canvas height={height} width={width} isArtMinted={isArtMinted}/>
      </div>
      <div className='flex justify-center items-center text-sm pt-3 pb-5'>
          Drag and drop tiles from above into the canvas at the top. Click on a tile in the canvas to remove it. When your canvas is full, click Make Art.
      </div>

      <div className="flex justify-center">
      
      {!isArtMinted &&
      <button 
        disabled={false}
        onClick={() => { makeArt() }} 
        className="bg-gray-200 hover:bg-purple-900 hover:text-white text-black text-lg font-bold py-2 px-4 mr-2 ml-2 rounded-full font-quantico">
          Make Art
      </button>
      }
      {isArtMinted &&
        <Box display="flex" justifyContent="center" width="100%" mt={8}>
        <VStack p="6">
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            Your painting is now part of your collection.
          </Text>
          <Link href={'/my-art'} passHref>
            <Button as="a" borderRadius="full">
              Your Collection
            </Button>
          </Link>
          </VStack>
        </Box>
      }
    </div>
    </div>

    </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        </div>
    </div>
  );
}
