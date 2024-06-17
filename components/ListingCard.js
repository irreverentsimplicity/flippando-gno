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
import { Alert, Box, Text, VStack, HStack, Button, Spacer, CloseButton } from "@chakra-ui/react";
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

const ListingCard = ({ seller, playerAddress, price, artwork, numCols, onRemoveListing, onBuy }) => {
  const imageWidth = 300; // Fixed image width
  const tileSize = imageWidth / numCols; 
  
  console.log("seller ", seller);
  console.log("playerAddress ", playerAddress);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [buyButtonLabel, setBuyButtonLabel] = useState("Buy")
  const [removeListingButtonLabel, setRemoveListingButtonLabel] = useState("Remove listing")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [totalFlip, setTotalFlip] = useState((price/1000).toString())
  const [flipPaid, setFlipPaid] = useState("")
  const [flipBurned, setFlipBurned] = useState("")
  
  
  const OverlayModal = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )

  const handleBuyClick = async () => {
    console.log("buy listing call")
    const actions = await Actions.getInstance();
    setBuyButtonLabel("Buying...")
    try {
        actions.BuyNFT(playerAddress, artwork.tokenID).then((response) => {
          console.log("buyNFT response in ListingCard.js", response);
          if (response.error === ""){
            setShowSuccessAlert(true)
            setFlipPaid((response.flipPaid/1000).toString())
            setFlipBurned((response.flipBurned/1000).toString())
            onBuy()
          }
        });
    } catch (error) {
        console.error('Error buying listing:', error);
        setBuyButtonLabel("Buy")
    };
  };

  const handleRemoveListing = async () => {
    console.log("remove listing call")
    setRemoveListingButtonLabel("Removing listing...")
    const actions = await Actions.getInstance();
        
    try {
        actions.RemoveNFTListing(artwork.tokenID, seller).then((response) => {
          console.log("removeNFTListing response in ListingCard.js", response);
          if(response == ""){
            setRemoveListingButtonLabel("Listing removed")
            onRemoveListing()
          }
        });
    } catch (error) {
        console.error('Error removing listing:', error);
        setRemoveListingButtonLabel("Remove listing")
        return null;
    }
      
  };

  const handleModalCloseOnSuccess = async () => {
    setShowSuccessAlert(false)
  }

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
        >{buyButtonLabel}</Button>
        }
        {seller === playerAddress &&
        <Button
          bg="purple.900"               
          color="white"               
          _hover={{ bg: "blue.600"}}
          borderRadius="full"
          onClick={handleRemoveListing}      
        >{removeListingButtonLabel}</Button>
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
    {showSuccessAlert && (
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
        zIndex="1000">
          <div style={{marginTop: '45px', marginBlock: '20px'}}>Transaction complete! You paid {totalFlip} FLIP, out of which {flipPaid} FLIP was sent to the seller, and {flipBurned} FLIP was burned.</div>
          <CloseButton position="absolute" right="8px" top="8px" onClick={() => handleModalCloseOnSuccess()} />
        </Alert>
      )}
    </div>
  );
};

export default ListingCard 