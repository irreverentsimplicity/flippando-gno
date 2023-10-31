/* pages/my-art.js */
//import { ethers } from 'ethers'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ArtworkComponent from '../components/ArtworkComponent';
import artNFT from  './../pages/assets/artNFT.png'


const FlippandoNFTs = () => {
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });
  const [tokenURIs, setTokenURIs] = useState([]);
  const [revealMatrix, setRevealMatrix] = useState([]);


  useEffect(() => {
    if (ownedNFTs.length > 0) {
      getBoardDimensions(ownedNFTs[0]);
    }
  }, [ownedNFTs]);

  useEffect(() => {
    if (ownedNFTs.length > 0) {
      revealBundledNFTs(ownedNFTs);
    }
  }, [ownedNFTs]);

  useEffect(() => {
    const getOwnedNFTs = async () => {
      try {
        console.log("get users' NFT")
        let tokenIds = [];
        if(tokenIds !== undefined){
        setOwnedNFTs(tokenIds);
        }
        
      } catch (error) {
        console.log('Error:', error);
      }
    };
    getOwnedNFTs();
  }, []);



  const getTokenURI = async (tokenId) => {
    try {
      console.log("getTokenURi for tokenId")

      //return tokenURI;
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getBoardDimensions = async (tokenId) => {
    try {

      console.log("Retrieve the board dimensions from the bundled artwork")
      
      const boardWidth = 16;
      const boardHeight = 16;

      setBoardDimensions({ width: boardWidth, height: boardHeight });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getArtwork = async (tokenId) => {
    try {
      console.log("getArtwork")
    } catch (error) {
      console.error('Error retrieving Artwork:', error);
      return null;
    }
  }

  const revealBundledNFTs = async (tokenId) => {
      //console.log('revealBundledNFTs for tokenID ' + tokenId)
      return <ArtworkComponent tokenId={tokenId} />
    
  };

  return (
    <div>
      <div className='flex justify-center items-center mt-[60px]'>
        <Image src={artNFT} alt="nft" width={700} height={400} layout='fixed'/>
      </div>
      <ul>
        {ownedNFTs.map((tokenId, index) => (
          <li key={index}>{tokenId}
          <ArtworkComponent tokenId={tokenId} />
          </li>
        ))}
        
      </ul>
      
    </div>
  );
};

export default FlippandoNFTs;
