import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, HStack, Button, Spacer, Alert, FormControl, FormLabel, Input, CloseButton } from "@chakra-ui/react";
import Actions from '../util/actions';
import Spinner from './Spinner';
import card from '@material-tailwind/react/theme/components/card';

const BasicNFTSmallTile = ({ size, basicNFT, tokenID }) => {
  console.log("basicNFT", JSON.stringify(basicNFT))
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
      <img src={"data:image/svg+xml;base64," + basicNFT.svgData} alt={tokenID} />
    </div>
  );
};

const BasicNFTCard = ({ title, text, cardData, numRows, numCols, onTrigger }) => {
  const imageWidth = 300; // Fixed image width
  const tileSize = 300; 

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isListing, setIsListing] = useState(false);

  console.log("cardData ", JSON.stringify(cardData))

  const handleTrigger = () => {
    if (onTrigger) {
        onTrigger();
    }
  };

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
        actions.ListBasicNFT(tokenId, seller, price).then((response) => {
          console.log("ListBasicNFT response in BasicNFTCard.js", response);
          //let parsedResponse = JSON.parse(response);
          console.log("Listing parsedResponse", response)
          if(response === ""){
            setIsListing(false)
            closeAlert()
            setShowSuccessAlert(true)
            handleTrigger()
          }
          else if (response.error !== undefined) {
            console.log('ListNFT error message: ', response.error)
            setIsListing(false)
            closeAlert()
            setErrorMessage(response.error)
            setShowErrorAlert(true)
          }
        });
      } catch (error) {
        console.error('Error listing Basic NFT:', error);
        setIsListing(false)
        closeAlert()
        //return null;
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
      {cardData.svgData === undefined &&
        <div style={{
        justifyContent: "center", alignItems: "center", display: 'flex', flexWrap: 'wrap', width: `${imageWidth}px` }}>
          <Spinner style={{backgroundColor: 'red'}} loadingText={'loading...'} />
          </div>
        }
      <div style={{ display: 'flex', flexWrap: 'wrap', width: `${imageWidth}px` }}>
        {cardData.svgData !== undefined &&
           <BasicNFTSmallTile key={cardData.tokenID} size={`${tileSize}px`} basicNFT={cardData} tokenID={cardData.tokenID} />
        }
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
              onClick={() => handleList(document.querySelector('input[name="price"]').value, cardData.tokenID)}
            >
              List on Market
            </Button>
          </FormControl>
          <CloseButton position="absolute" right="8px" top="8px" onClick={closeAlert} />
        </Alert>
      )}
      {showErrorAlert && (
        <Alert 
        status="warning"
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
          <div style={{marginTop: '45px', marginBlock: '20px'}}>{errorMessage} We&apos;re on it.</div>
          <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowErrorAlert(false)} />
        </Alert>
      )}
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
          <div style={{marginTop: '45px', marginBlock: '20px'}}>Your NFT has been listed.</div>
          <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowSuccessAlert(false)} />
        </Alert>
      )}
    </Box>
    </div>
  );
};

export default BasicNFTCard 