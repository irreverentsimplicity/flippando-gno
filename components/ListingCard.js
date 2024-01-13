import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, HStack, Button, Spacer, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react";
import Spinner from './Spinner';
import Actions from '../util/actions';

const ArtSmallTile = ({ size, artNFT, tokenID }) => {
  //console.log("svgData", JSON.stringify(artNFT))
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

const ListingCard = ({ seller, playerAddress, price, artwork, numCols }) => {
  const imageWidth = 300; // Fixed image width
  const tileSize = imageWidth / numCols; 
  
  console.log("seller ", seller);
  console.log("playerAddress ", playerAddress);
  const [showAlert, setShowAlert] = useState(false);
  const handleButtonClick = () => {
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleRemoveListing = async () => {
    console.log("remove listing call")
    const actions = await Actions.getInstance();
        
    try {
        actions.RemoveNFTListing(artwork.tokenID, seller).then((response) => {
        console.log("removeNFTListing response in ListingCard.js", response);
        });
    } catch (error) {
        console.error('Error removing listing:', error);
        return null;
    }
      
  };

  return (
    <div style={{ position: 'relative' }}>
    <Box
      display="flex"
      flexDirection="column"
      maxW="sm"
      maxH="470px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      {artwork.artworkNFT === undefined &&
        <div style={{
        justifyContent: "center", alignItems: "center", display: 'flex', flexWrap: 'wrap', width: `${imageWidth}px` }}>
          <Spinner style={{backgroundColor: 'red'}} loadingText={'loading...'} />
          </div>
        }
      <div style={{ display: 'flex', flexWrap: 'wrap', width: `${imageWidth}px` }}>
        {artwork.artworkNFT !== undefined && artwork.artworkNFT.map((artNFT, index) => (
           <ArtSmallTile key={artNFT.tokenID} size={`${tileSize}px`} artNFT={artNFT} tokenID={artNFT.tokenID} />
        ))}
      </div>
      <Spacer />
      <VStack p="2">
        
      <Text fontWeight="200" lineHeight="tight">by: {seller.substr(0, Math.floor((seller.length - 20) / 2)) + "..." + seller.substr(Math.ceil((seller.length + 20) / 2))}</Text>
        <HStack p="1" borderWidth="1px"borderRadius="full" borderColor="purple.200" bg="purple.200" width="100%" justifyContent="space-between">
        <Text fontWeight="700" lineHeight="tight" color="black" isTruncated style={{marginLeft: 10}}>
          {price} FLIP
        </Text>
        {seller !== playerAddress &&
        <Button
          bg="purple.900"               
          color="white"               
          _hover={{ bg: "blue.600"}}
          borderRadius="full"
          onClick={handleButtonClick}         
        >Buy</Button>
        }
        {seller === playerAddress &&
        <Button
          bg="purple.900"               
          color="white"               
          _hover={{ bg: "blue.600"}}
          borderRadius="full"
          onClick={handleRemoveListing}      
        >Remove Listing</Button>
        }
        </HStack>
      </VStack>
      {showAlert && (
        <Alert 
        status="info"
        variant="solid"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        position="fixed" // or "absolute" depending on your layout
        top="50%"
        left="50%"
        width="300px"
        transform="translate(-50%, -50%)"
        zIndex="999">
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Coming soon!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            We&aposre working on this.
          </AlertDescription>
          <CloseButton position="absolute" right="8px" top="8px" onClick={closeAlert} />
        </Alert>
      )}
    </Box>
    </div>
  );
};

export default ListingCard 