/* pages/my-art.js */

import { useEffect, useState } from 'react';
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import Actions from './util/actions';
import { Box, Text } from "@chakra-ui/react";
import ArtGridLayout from '../components/ArtGridLayout';
import Spinner from '../components/Spinner';


const FlippandoNFTs = () => {
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [flipBalance, setFlipBalance] = useState(0);
  const [lockedFlipBalance, setLockedFlipBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    getArtwork();
  }, []);

  const getArtwork = async () => {
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    setIsLoading(true)

    try {
      console.log("getArtwork")
      actions.getUserCompositeNFTs(playerAddress,).then((response) => {
        console.log("getUserCompositeNFTs response in my-art.js", response);
        let parsedResponse = JSON.parse(response);
        //console.log("getUserCompositeNFTs parseResponse", parsedResponse)
        if(parsedResponse.error === undefined){
          fetchArtworkNFTsForAll(parsedResponse.userNFTs);
        }
      });
    } catch (error) {
      console.error('Error retrieving Artwork:', error);
      return null;
    }
  }

  const fetchArtworkNFTsForAll = async (compositeNFTs) => {
    const actions = await Actions.getInstance();
    const compositeNFTsWithArtwork = [];
  
    for (const compositeNFT of compositeNFTs) {
      const bTokenIds = JSON.stringify(compositeNFT.bTokenIDs);
      try {
        const response = await actions.getArtworkNFTs(bTokenIds);
        const parsedResponse = JSON.parse(response);
        if (!parsedResponse.error) {
          compositeNFTsWithArtwork.push({
            ...compositeNFT,
            artworkNFT: parsedResponse.userNFTs
          });
        } else {
          compositeNFTsWithArtwork.push(compositeNFT);
        }
      } catch (error) {
        console.error('Error retrieving basic NFTs for composite NFT:', error);
        compositeNFTsWithArtwork.push(compositeNFT);
      }
    }
    
    setOwnedNFTs(compositeNFTsWithArtwork);
    setIsLoading(false)
  };
  
  

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
        <div className='col-span-4 justify-start'>
        <Box className="justify-end" borderBottom="1px solid white" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" textAlign="right" mb={4} mr={4}>
            My Art
          </Text>
        </Box>
          {isLoading &&
            <div className="flex col-span-4 justify-center items-center">
            <Spinner loadingText={'Fetching art..'}/>
          </div>
          }
        <div className="col-span-4 flex justify-start">  
        {(ownedNFTs.length !== 0 && !isLoading) &&
          <ArtGridLayout cards={ownedNFTs} />
        }
        </div>
        
        </div>
      
      
    </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        
        </div>
    </div>

   
  );
};

export default FlippandoNFTs;
