import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
  } from '@chakra-ui/react'
import { Box, Text, VStack, HStack, Button, Spacer } from "@chakra-ui/react";
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
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const OverlayModal = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )

  const handleBuyClick = async () => {
    console.log("buy listing call")
    const actions = await Actions.getInstance();
        
    try {
        actions.BuyNFT(playerAddress, artwork.tokenID).then((response) => {
        console.log("buyNFT response in ListingCard.js", response);
        });
    } catch (error) {
        console.error('Error buying listing:', error);
        
    };
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
          onClick={onOpen}         
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
      {onOpen &&
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={'black'}>Let's go!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color='black'>You will pay {price} FLIP for this NFT.</Text>
            <Text fontSize="1xs" color='black'>A random percentage of the price sale, between 1% and 50% will be burned.</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleBuyClick}>
              Buy
            </Button>
            <Button colorScheme='red' mr={3} onClick={onClose}>
                Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      }
    </Box>
    </div>
  );
};

export default ListingCard 