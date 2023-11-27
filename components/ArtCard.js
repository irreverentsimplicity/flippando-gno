import React, { useEffect, useState } from 'react';
import { Box, Text, VStack } from "@chakra-ui/react";
import Actions from "../pages/util/actions";

const ArtSmallTile = ({ size, nft, tokenID }) => {
  console.log("svgData", JSON.stringify(nft))
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "0px", border: "0px", width: size, height: size }}>
     <img src={"data:image/svg+xml;base64," + nft.svgData} alt={tokenID}/>
    </div>
  );
};

const ArtCard = ({ title, text, artwork, numRows, numCols }) => {
  const imageWidth = 160; // Fixed image width
  const tileSize = imageWidth / numCols; // Calculate tile size based on the number of columns
  console.log('artwork ' + JSON.stringify(artwork));
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    fetchArtworkNFTs();
}, []);

const fetchArtworkNFTs = async () => {
  console.log("fetchArtworkNFTs in ArtCard", JSON.stringify(artwork, null, 2))
  const actions = await Actions.getInstance();
  const bTokenIds = JSON.stringify(artwork.bTokenIDs)
  try {
    console.log("fetchArtworkNFTs in ArtCard")
    actions.getArtworkNFTs(bTokenIds,).then((response) => {
      console.log("getArtworkNFTs response in ArtCard", response);
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

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <div style={{ display: 'flex', flexWrap: 'wrap', width: `${imageWidth}px` }}>
        {nfts.map((nft, index) => (
           <ArtSmallTile key={index} size={`${tileSize}px`} nft={nft} tokenID={nft.tokenID} />
        ))}
      </div>
      <VStack p="6">
        <Text fontWeight="bold" as="h4" lineHeight="tight" isTruncated>
          {title}
        </Text>
        <Text>{text}</Text>
      </VStack>
    </Box>
  );
};

export default ArtCard 