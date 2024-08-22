/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';;
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Box, Text, Link, Button, VStack } from "@chakra-ui/react";
import Spinner from './Spinner';
import { setArtPayload } from '../slices/flippandoSlice';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import CanvasGridItem from './CanvasGridItem';
import CanvasSquare from './CanvasSquare';
import Actions from '../util/actions';


const SimpleCanvas = ({height, width}) => {

    // Constants for the 8x8 grid
    const gridWidth = 8;
    const gridHeight = 8;

    const placeHolderNFT = {tokenId: 0, metadata: {tokenId: 0, image: 'i'}};
    const [sourceGrid, setSourceGrid] = useState([]);
    const [canvas, setCanvas] = useState(Array(height*width).fill(placeHolderNFT));
    const [gridCanvas, setGridCanvas] = useState(Array(gridWidth*gridHeight).fill(placeHolderNFT));
    const [indexSourceGrid, setIndexSourceGrid] = useState(null);
    const [indexTrack, setIndexTrack] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);
    const [isArtMinted, setIsArtMinted] = useState(false)
    const [isMintingArt, setIsMintingArt] = useState(false)
    const artPayload = useSelector(state => state.flippando.artPayload);
    const userLoggedIn = useSelector(state => state.flippando.userLoggedIn);
    const dispatch = useDispatch();
    const router = useRouter();

    // Calculate start and end for draggable area
    const startRow = Math.floor((gridHeight - height) / 2);
    const endRow = startRow + height;
    const startCol = Math.floor((gridWidth - width) / 2);
    const endCol = startCol + width;
    
    useEffect(() => {
      const fetchNFTs = async () => {
        console.log("fetchNFTs");
        setIsLoading(true);
    
        try {
          const actions = await Actions.getInstance();
          const playerAddress = await actions.getWalletAddress();
          const response = await actions.getAllNFTs(playerAddress);
    
          let parsedResponse = JSON.parse(response);
          if (parsedResponse.userNFTs !== undefined && parsedResponse.userNFTs.length !== 0) {
            let nftData = [];
            let userListings = [];
    
            try {
              const listingsResponse = await actions.getBasicListings();
              let parsedListingsResponse = JSON.parse(listingsResponse);
              console.log("getBasicListings parseListingResponse in Canvas.js", parsedListingsResponse);
              
              if (parsedListingsResponse.error === undefined) {
                userListings = parsedListingsResponse.marketplaceListings;
                
                if (userListings.length !== 0) {
                  const filteredBasicNFTs = parsedResponse.userNFTs.filter(nft =>
                    !userListings.some(listing => listing.tokenID === nft.tokenID)
                  );
                  console.log("filteredBasicNFTs: ", JSON.stringify(filteredBasicNFTs));
                  
                  filteredBasicNFTs.forEach((nftItem) => {
                    if((nftItem.airdropName === "" && nftItem.gameType !== "airdrop")){
                      nftData.push({
                        tokenId: nftItem.tokenId,
                        metadata: nftItem,
                      });
                    }
                  });
                } else {
                  parsedResponse.userNFTs.forEach((nftItem) => {
                    // filter by airdrop name empty and gameType not "airdrop"
                    console.log("nftItem ", JSON.stringify(nftItem));
                    if((nftItem.airdropName === "" && nftItem.gameType !== "airdrop")){
                      nftData.push({
                        tokenId: nftItem.tokenId,
                        metadata: nftItem,
                      });
                    }
                  });
                }
              } else {
                console.error('Error in listings response:', parsedListingsResponse.error);
              }
            } catch (error) {
              console.error('Error retrieving BasicNFTs:', error);
            }
    
            if (nftData.length !== 0) {
              console.log("nftData.length !== 0", JSON.stringify(nftData));
              setSourceGrid(nftData);
            }
          }
        } catch (err) {
          console.log("error in calling getAllNFTs", err);
        } finally {
          setIsLoading(false);
        }
      };
      if(userLoggedIn === "1"){
        fetchNFTs();
      }
      else if(userLoggedIn === "0"){
        setSourceGrid([])
        setCanvas(Array(height*width).fill(placeHolderNFT))
        setIndexSourceGrid(null)
        setIndexTrack([{}])
      }
    }, [userLoggedIn]);
    

    useEffect( () => {
      if (isArtMinted) {
        const fetchNFTs = async () => {
          console.log("fetchNFTs");
          setIsLoading(true);
      
          try {
            const actions = await Actions.getInstance();
            const playerAddress = await actions.getWalletAddress();
            const response = await actions.getAllNFTs(playerAddress);
      
            let parsedResponse = JSON.parse(response);
            if (parsedResponse.userNFTs !== undefined && parsedResponse.userNFTs.length !== 0) {
              let nftData = [];
              let userListings = [];
      
              try {
                const listingsResponse = await actions.getBasicListings();
                let parsedListingsResponse = JSON.parse(listingsResponse);
                console.log("getBasicListings parseListingResponse in Canvas.js", parsedListingsResponse);
                
                if (parsedListingsResponse.error === undefined) {
                  userListings = parsedListingsResponse.marketplaceListings;
                  
                  if (userListings.length !== 0) {
                    const filteredBasicNFTs = parsedResponse.userNFTs.filter(nft =>
                      !userListings.some(listing => listing.tokenID === nft.tokenID)
                    );
                    console.log("filteredBasicNFTs: ", JSON.stringify(filteredBasicNFTs));
                    
                    filteredBasicNFTs.forEach((nftItem) => {
                      nftData.push({
                        tokenId: nftItem.tokenId,
                        metadata: nftItem,
                      });
                    });
                  } else {
                    parsedResponse.userNFTs.forEach((nftItem) => {
                      // filter by airdrop name empty and gameType not "airdrop"
                      if((nftItem.airdropName === "" && nftItem.gameType !== "airdrop")){
                        nftData.push({
                          tokenId: nftItem.tokenId,
                          metadata: nftItem,
                        });
                      }
                    });
                  }
                } else {
                  console.error('Error in listings response:', parsedListingsResponse.error);
                }
              } catch (error) {
                console.error('Error retrieving BasicNFTs:', error);
              }
      
              if (nftData.length !== 0) {
                console.log("nftData.length !== 0", JSON.stringify(nftData));
                setSourceGrid(nftData);
              }
            }
          } catch (err) {
            console.log("error in calling getAllNFTs", err);
          } finally {
            setIsLoading(false);
          }
        };
        if(userLoggedIn === "1"){
          fetchNFTs();
        }
      }
    }, [isArtMinted, userLoggedIn])

  const handleDrop = (index) => {
    const updatedCanvas = [...canvas];
    updatedCanvas[index] = sourceGrid[indexSourceGrid];
    setCanvas(updatedCanvas);
    checkAndPrepareArtPayload(updatedCanvas);
    const updatedSourceGrid = [...sourceGrid];
    updatedSourceGrid[indexSourceGrid] = placeHolderNFT;
    setSourceGrid(updatedSourceGrid);
    let idxTrack = {'canvasIndex': index, 'gridIndex': indexSourceGrid};
    let indexTrackCopy = [...indexTrack];
    indexTrackCopy.push(idxTrack);
    setIndexTrack(indexTrackCopy);
    
  };

  const handleDragStart = (index) => {
    setIndexSourceGrid(index);
    const updatedSourceGrid = [...sourceGrid];
    updatedSourceGrid[index] = placeHolderNFT;
  };

  const handleClick = (index) => {
    // update source grid with the actual nft
    // find position in index tracking
    const idxTuple = indexTrack.filter(obj => obj.canvasIndex === index);
    // remove the entry to avoid duplicates
    let indexTrackCopy = [...indexTrack];
    var trimmedArray = indexTrackCopy.filter(obj => obj.canvasIndex !== index);
    setIndexTrack(trimmedArray);
    const updatedSourceGrid = [...sourceGrid];
    if(idxTuple[0]?.gridIndex !== undefined){
      updatedSourceGrid[idxTuple[0].gridIndex] = canvas[index];
      setSourceGrid(updatedSourceGrid);
      // empty canvas
      const updatedCanvas = [...canvas];
      updatedCanvas[index] = placeHolderNFT;
      setCanvas(updatedCanvas);
    }

  }

  const checkAndPrepareArtPayload = (updatedCanvas) => {
    let tokenIds = [];
    console.log("makeArt, updatedCanvas.length ", updatedCanvas.length)
    updatedCanvas.map( (nft, index) => {
      console.log("makeArt, nft ", JSON.stringify(nft, null, 2))
        if(nft.metadata.tokenId != 0){
            tokenIds.push(nft.metadata.tokenID);
        }
        else {
          // we check later the art payload for this and stop composite nft creation
          // if there is any
          tokenIds[index] = "0"
        }
        
    });
    
    if (tokenIds.length === (height*width)){
        dispatch(setArtPayload([height, width, tokenIds]));
    }
  }

  const renderCanvas = () => {
    let realIndex = -1;
    let clickableArray = [];

    gridCanvas.map((nft, index) => {
      const row = Math.floor(index / gridWidth);
      const col = index % gridWidth;
      const canAcceptDrop = row >= startRow && row < endRow && col >= startCol && col < endCol;

      if (canAcceptDrop) {
        realIndex++;
        clickableArray[index] = realIndex;
      }
    });

    return gridCanvas.map((nft, index) => {
      const row = Math.floor(index / gridWidth);
      const col = index % gridWidth;
      const canAcceptDrop = row >= startRow && row < endRow && col >= startCol && col < endCol;
      let canvasNFT = canvas[clickableArray[index]]
        return (
          <CanvasSquare
            key={index}
            index={clickableArray[index]}
            onClick={() => handleClick(clickableArray[index])}
            isOccupied={canvasNFT !== undefined && canvasNFT.tokenId !== 0 ?  true : false}
            nft={canvasNFT}
            onDrop={() => handleDrop(clickableArray[index])}
            canAcceptDrop={canAcceptDrop}
          />
        );      
    })
  }

  async function makeArt(){
    const actions = await Actions.getInstance();
    if(actions.hasWallet()){
      const playerAddress = await actions.getWalletAddress();
      const height = artPayload[0]
      const width = artPayload[1]
      
      const bTokenIDs = JSON.stringify(artPayload[2], (key, value) => 
        (key === '' ? value : parseInt(value))
      );
      console.log("makeArt, ", JSON.stringify(artPayload))
      if (artPayload.length === 0 ) {
        alert("You have to fill the entire canvas")
      }
      if (artPayload[2] !== undefined && artPayload[2].includes("0")){
        alert("You have to fill the entire canvas")
      }
      if (artPayload.length !== 0 && !artPayload[2].includes("0")){
        setIsMintingArt(true)
        try {
          actions.createCompositeNFT(playerAddress, String(width), String(height), bTokenIDs).then((response) => {
            console.log("createCompositeNFT response in Playground", response);
            let parsedResponse = JSON.parse(response);
            console.log("createCompositeNFT parseResponse", parsedResponse)
            if(parsedResponse.error === undefined){
              setIsArtMinted(true)
              
            }
            setIsMintingArt(false)
          });
        } catch (err) {
          console.log("error in calling createCompositeNFT", err);
        }
      } 
    }
    else {
      alert("Looks like you're logged out. Log in to play.")
    }
  }

  const navigateToInventory = () => {
    router.push('./inventory')
  }

  return (
    <div className='flex items-center' style={{ marginTop: 20, marginBottom: 20, flexDirection: 'column' }}>     
  <div className='flex justify-center items-center' style={{ flexDirection: 'row', width: '100%', height: '100%' }}>
    <div style={{ flex: 1, marginRight: '10px', height: '80vh', overflowY: 'auto' }}>
      <Box 
        w="100%" 
        h="100%"
        mt="4" 
        p="1"
        borderWidth="0.5px" 
        borderColor="#ececec"
        borderRadius="lg" 
        overflow="hidden"  
        display="flex"
        flexDirection="column"
        alignItems="center">
        {isLoading &&
          <Box display="flex" justifyContent="center" width="100%" height="100%" mt={20}>
            <Spinner loadingText={'loading...'}/>
          </Box>
        }
        <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(8, 1fr)', gridGap: '2px' }}>  
          { (sourceGrid !== undefined && !isLoading) && sourceGrid.map((nft, index) => (
            <CanvasGridItem key={index} nft={nft} onDragStart={() => handleDragStart(index)} /> 
          ))}
        </div>
        {(!isLoading && sourceGrid.length === 0) && 
          <Box display="flex" justifyContent="center" width="100%" height="100%" mt={20}>
            Nothing here yet.
          </Box>
        }
      </Box>
    </div>
    <div style={{ flex: 1, position: 'relative', paddingLeft: '10px', height: '100%', justifyContent: "flex-start" }}>
      <div style={{
        display: "flex",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: '100%'
      }}>
        <div style={{ 
          display: 'inline-grid', 
          background: 'gray',
          gridTemplateColumns: `repeat(${gridWidth}, 1fr)`, 
          gridTemplateRows: `repeat(${gridHeight}, 1fr)`, 
          gridGap: '0.5px', 
          position: 'relative',
          height: '100%',
        }}>
          {renderCanvas()}
          
        </div>
        
        
        {height <= 2 &&
          <Text fontSize='xs' style={{ paddingTop: 20, paddingLeft: 40, paddingRight: 40 }}>
            Looks like you are on the minimum canvas size. There must be more basic NFT minted for a larger size. Read more <Link color='teal.500' href='/docs'>here</Link>.  
          </Text>
        }
        {height > 2 && height <= 7 &&
          <Text fontSize='xs' style={{ paddingTop: 20, paddingLeft: 40, paddingRight: 40 }}>
            You are not playing on the maximum canvas size. Read more <Link color='teal.500' href='/docs'>here</Link>.  
          </Text>
        }
        {height > 7 &&
          <Text fontSize='xs' style={{ paddingTop: 20, paddingLeft: 40, paddingRight: 40 }}>
            You are playing on the maximum canvas size, your art will have the best resolution.  
          </Text>
        }
        <div className="flex justify-center">
      
      {!isArtMinted &&
      <Button 
      disabled={false}
      onClick={() => { makeArt() }} 
      bg="purple.900"
      color="white"
      fontSize="lg"
      fontWeight="bold"
      py={2}
      px={4}
      mt={3}
      borderRadius="lg"
      _hover={{
        bg: "purple.800",
        color: "white",
      }}
    >
      {!isMintingArt &&
        <div>Mint This Painting</div>
      }
      {isMintingArt &&
        <Spinner size="sm" />
      }
    </Button>
    
      }
      {isArtMinted &&
        <Box display="flex" justifyContent="center" width="100%" mt={8}>
        <VStack p="6">
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            Your painting is now part of your collection.
          </Text>
          
          <Button 
            disabled={false}
            onClick={navigateToInventory}
            bg="purple.900"
            color="white"
            fontSize="lg"
            fontWeight="bold"
            py={2}
            px={4}
            mt={3}
            borderRadius="lg"
            _hover={{
              bg: "purple.800",
              color: "white",
            }}
          >
              Your Collection
            </Button>
          
          </VStack>
        </Box>
      }
    
      </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default SimpleCanvas;
