import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, HStack, Button, Spacer, Alert, FormControl, FormLabel, Input, CloseButton } from "@chakra-ui/react";
import Actions from '../util/actions';
import Spinner from './Spinner';

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

const ArtCard = ({ title, text, artwork, numRows, numCols }) => {
  const imageWidth = 300; // Fixed image width
  const tileSize = imageWidth / numCols; 

  const [showAlert, setShowAlert] = useState(false);
  const [isListing, setIsListing] = useState(false);

  const handleButtonClick = () => {
    setShowAlert(true);
  };

  const handleList = async (price, tokenId) => {
    console.log("handleList ", price, tokenId)
    
    if (price !== "" && price !== null && price !== undefined) {
      const actions = await Actions.getInstance();
      const seller = await actions.getWalletAddress();

      setIsListing(true)
      
      try {
        actions.ListNFT(tokenId, seller, price).then((response) => {
          console.log("ListNFT response in ArtCard.js", response);
          let parsedResponse = JSON.parse(response);
          //console.log("getUserCompositeNFTs parseResponse", parsedResponse)
          if(parsedResponse.error === undefined){
            setIsListing(false)
            closeAlert()
          }
        });
      } catch (error) {
        console.error('Error listing Artwork:', error);
        return null;
      }
    }
  }

  const closeAlert = () => {
    setShowAlert(false);
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
        <Text fontWeight="500" lineHeight="tight" isTruncated>
          {title}
        </Text>
        <Text fontWeight="200" lineHeight="tight">{text}</Text>
        <HStack p="1" borderWidth="1px"borderRadius="full" borderColor="purple.200" bg="purple.200" width="100%" justifyContent="end">
        {/*<Button
          bg="purple.900"               
          color="white"               
          _hover={{ bg: "blue.600"}}
          borderRadius="full"
          onClick={handleButtonClick}         
        >Transfer</Button>*/}
        {!isListing &&
            <Button
            bg="purple.900"               
            color="white"               
            _hover={{ bg: "blue.600"}}
            borderRadius="full"   
            onClick={handleButtonClick}           
          >List</Button>
        }
        {isListing &&
          <Button
          bg="purple.900"               
          color="white"               
          _hover={{ bg: "blue.600"}}
          borderRadius="full"   
          disabled={true}          
        >Listing...</Button>
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
          <FormControl id="price">
            <FormLabel htmlFor="price">Price wanted ($FLIP)</FormLabel>
            <Input
              type="text"
              name="price"
              placeholder="Enter price"
              mb={4}
            />
            <Button
              colorScheme="blue"
              onClick={() => handleList(document.querySelector('input[name="price"]').value, artwork.tokenID)}
            >
              List on Market
            </Button>
          </FormControl>
          <CloseButton position="absolute" right="8px" top="8px" onClick={closeAlert} />
        </Alert>
      )}
    </Box>
    </div>
  );
};

export default ArtCard 