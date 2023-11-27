/* pages/my-art.js */
//import { ethers } from 'ethers'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import RenderCompositeNFT from '../components/RenderCompositeNFT';
import artNFT from  './../pages/assets/artNFT.png'
import Actions from './util/actions';


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
    getArtwork();
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

  const getArtwork = async () => {
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();

    try {
      console.log("getArtwork")
      actions.getUserCompositeNFTs(playerAddress,).then((response) => {
        console.log("getUserCompositeNFTs response in Flip", response);
        let parsedResponse = JSON.parse(response);
        console.log("getUserCompositeNFTs parseResponse", parsedResponse)
        if(parsedResponse.error === undefined){
          setOwnedNFTs(parsedResponse.userNFTs);
        }
      });
    } catch (error) {
      console.error('Error retrieving Artwork:', error);
      return null;
    }
  }

  return (
    <div>
      <ul>
        {ownedNFTs.length !== 0 && ownedNFTs.map((compositeNFT, index) => (
          <li key={index}>{compositeNFT.tokenId}
          <RenderCompositeNFT artwork={compositeNFT} />
          </li>
        ))}
        
      </ul>
      
    </div>
  );
};

export default FlippandoNFTs;
