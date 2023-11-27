import React, { useEffect, useState } from 'react';
import ArtSmallTile from './ArtSmallTile';
import styles from '../styles/Home.module.css'
import Actions from '../pages/util/actions';

function RenderCompositeNFT({ artwork }) {
    console.log('artwork ' + JSON.stringify(artwork));
    const [nfts, setNfts] = useState([]);
    const buildingBlocks = artwork.buildingBlocks;
    const boardWidth = artwork.boardWidth;
    const boardHeight = artwork.boardHeight; 
    const levelBoard = new Array(boardWidth, boardHeight).fill(0);

    useEffect(() => {
        fetchArtworkNFTs();
    }, []);
  
    const fetchArtworkNFTs = async () => {
      console.log("fetchArtworkNFTs", JSON.stringify(artwork, null, 2))
      const actions = await Actions.getInstance();
      const bTokenIds = JSON.stringify(artwork.bTokenIDs)
      try {
        console.log("fetchArtworkNFTs")
        actions.getArtworkNFTs(bTokenIds,).then((response) => {
          console.log("getArtworkNFTs response in RenderCompositeNFT", response);
          let parsedResponse = JSON.parse(response);
          console.log("getArtworkNFTs parseResponse", parsedResponse)
          if(parsedResponse.error === undefined){
            setNfts(parsedResponse.userNFTs);
          }
        });
      } catch (error) {
        console.error('Error retrieving Artwork:', error);
        return null;
      }
    

    }


  const renderBoard = () => {
    const gridItems = [];
  
    for (let row = 0; row < artwork.canvasHeight; row++) {
      for (let col = 0; col < artwork.canvasWidth; col++) {
        const index = row * artwork.canvasHeight + col;
        const value = nfts[index];
  
        gridItems.push(
          <span key={index} className={styles.gridItem}>
              <ArtSmallTile metadata={JSON.stringify(value)} />
          </span>
        );
      }
    }
  
    return <div className={`inline-grid grid-cols-${artwork.canvasWidth} grid-rows-${artwork.canvasHeight} gap-x-0 gap-y-0`}>{gridItems}</div>;
  };

  // Render the artwork component
  return (
    <div>
      <h2>Composite NFT Details</h2>
      {nfts.length !== 0 && renderBoard()}
    </div>
  );
}

export default RenderCompositeNFT;
