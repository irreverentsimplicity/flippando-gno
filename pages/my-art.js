/* pages/my-art.js */

import { useEffect, useState } from 'react';
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import RenderCompositeNFT from '../components/RenderCompositeNFT';
import Actions from './util/actions';
import ArtGridLayout from '../components/ArtGridLayout';


const FlippandoNFTs = () => {
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [flipBalance, setFlipBalance] = useState(0);
  const [lockedFlipBalance, setLockedFlipBalance] = useState(0);
  
  useEffect(() => {
    getArtwork();
  }, []);

  const getArtwork = async () => {
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();

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
      
        <div className="col-span-4 flex justify-end">
        {ownedNFTs.length !== 0 &&
          <ArtGridLayout cards={ownedNFTs} />
        }
        </div>
      
      
    </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        
        </div>
    </div>

   
  );
};

export default FlippandoNFTs;
