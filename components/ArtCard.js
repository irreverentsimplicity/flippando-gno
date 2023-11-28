import React, { useEffect, useState } from 'react';
import { Box, Text, VStack } from "@chakra-ui/react";
import Actions from "../pages/util/actions";

const ArtSmallTile = ({ size, artNFT, tokenID }) => {
  console.log("svgData", JSON.stringify(artNFT))
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      margin: "0px",
      border: "0px",
      width: size,
      height: size,
      backgroundColor: 'white', // Resets background color
    }}>
      <img src={"data:image/svg+xml;base64," + artNFT.svgData} alt={tokenID} />
    </div>
  );
};

const ArtCard = ({ title, text, artwork, numRows, numCols }) => {
  const imageWidth = 180; // Fixed image width
  const tileSize = imageWidth / numCols; 

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <div style={{ display: 'flex', flexWrap: 'wrap', width: `${imageWidth}px` }}>
        {artwork.artworkNFT !== undefined && artwork.artworkNFT.map((artNFT, index) => (
           <ArtSmallTile key={artNFT.tokenID} size={`${tileSize}px`} artNFT={artNFT} tokenID={artNFT.tokenID} />
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