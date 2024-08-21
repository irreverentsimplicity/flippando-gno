/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Text, Link, HStack, VStack, Button, Flex, filter, position } from "@chakra-ui/react";
import NextLink from 'next/link';
import Spinner from './Spinner';
import { setArtPayload } from '../slices/flippandoSlice';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Actions from '../util/actions';
import CanvasGridItem from './CanvasGridItem';
import CanvasSquare from './CanvasSquare';
import SwitchButton from './SwitchButton';

const AirdropData = ({totalNFTsMinted, avaialableForParent, totalNeededForParent}) => {
  return(
    <div className='flex justify-between w-full mb-1'>
      <Text>{totalNFTsMinted} NFTs minted in this airdrop</Text>
      <Text>{avaialableForParent} available to complete this image, out of {totalNeededForParent} needed.</Text>
    </div>
  )
}

const AirdropCanvas = ({height, width}) => {

    // Constants for the 8x8 grid
    const gridWidth = 8;
    const gridHeight = 8;

    const placeHolderNFT = {tokenId: 0, metadata: {image: 'i'}};
    const [sourceGrid, setSourceGrid] = useState([]);
    const [totalNFTsMinted, setTotalNFTsMinted] = useState([]);
    const [totalAirdropNFTsMinted, setTotalAirdropNFTsMinted] = useState([]);
    const [avaialableForParent, setAvailableForParent] = useState([]);
    const [totalNeededForParent, setTotalNeededForParent] = useState(0);
    const [canvas, setCanvas] = useState(Array(height*width).fill(placeHolderNFT));
    const [gridCanvas, setGridCanvas] = useState(Array(gridWidth*gridHeight).fill(placeHolderNFT));
    const [indexSourceGrid, setIndexSourceGrid] = useState(null);
    const [indexTrack, setIndexTrack] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);
    const [assistiveImage, setAssistiveImage] = useState(true);
    const [isArtMinted, setIsArtMinted] = useState(false)
    const [isMintingArt, setIsMintingArt] = useState(false)
    const artPayload = useSelector(state => state.flippando.artPayload);
    const dispatch = useDispatch();

    // Calculate start and end for draggable area
    const startRow = Math.floor((gridHeight - height) / 2);
    const endRow = startRow + height;
    const startCol = Math.floor((gridWidth - width) / 2);
    const endCol = startCol + width;

    // used for assitive image array
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentNFTIndex, setCurrentNFTIndex] = useState(0);
    const images = [];
    const airdropCompositeNFTs = [];
    const [isNextDisabled, setIsNextDisabled] = useState(false);
    const [isPrevDisabled, setIsPrevDisabled] = useState(true);

    // generate the images array
    for (let i = 1; i <= 157; i++) {
      images.push(`/assets/hacker_pixelated_${i}.jpeg`);
      airdropCompositeNFTs.push(`${i}`)
    }

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
                    // filter by airdrop name, so far it's hardcoded to airdrop/hackerville/1
                    if(nftItem.airdropName !== "" && nftItem.airdropName === "hackerville"){
                      nftData.push({
                        tokenId: nftItem.tokenId,
                        metadata: nftItem,
                      });
                    }
                  });
                } else {
                  parsedResponse.userNFTs.forEach((nftItem) => {
                    // filter by airdrop name, so far it's hardcoded to airdrop/hackerville/1
                    if((nftItem.airdropName !== "" && nftItem.airdropName === "hackerville")){
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
              //console.log("nftData.length !== 0", JSON.stringify(nftData));
              setTotalNFTsMinted(nftData)
              const filteredArray = nftData.filter(item => item.metadata.airdropParentID == airdropCompositeNFTs[currentNFTIndex]);
              setTotalNeededForParent(nftData[0].metadata.gameLevel);
              setAvailableForParent(filteredArray);
              setSourceGrid(filteredArray);
            }
          }
        } catch (err) {
          console.log("error in calling getAllNFTs", err);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchNFTs();
      getMintedNFTs();
    }, []);
    

    useEffect( () => {
      if (isArtMinted) {
        const fetchNFTs = async () => {
        setIsLoading(true);

          const actions = await Actions.getInstance();
          const playerAddress = await actions.getWalletAddress();
          try {
            actions.getAllNFTs(playerAddress).then((response) => {
              //console.log("getAllNFTS response in Canvas", response);
              let parsedResponse = JSON.parse(response);
              //console.log("parseResponse", parsedResponse)
              if(parsedResponse.userNFTs !== undefined && parsedResponse.userNFTs.length !== 0){
                  let nftData = []
                  parsedResponse.userNFTs.map((nftItem) => {
                    nftData.push({
                      tokenId: nftItem.tokenId,
                      metadata: nftItem,
                    })
                  })
                
                if(nftData.length !== 0){
                  setSourceGrid(nftData);
                }
                
              }
              setIsLoading(false);
            });
          } catch (err) {
            console.log("error in calling getAllNFTs", err);
          }
        }
        fetchNFTs()
      }
    }, [isArtMinted])

    const getMintedNFTs = async () => {
      const actions = await Actions.getInstance();
      
        try {
          actions.GetAllMintedAirdropNFTs().then((response) => {
            if (response !== undefined){
              let parsedResponse = JSON.parse(response);
              if (parsedResponse.length != 0) {
                console.log("getMintedNFTs, ", JSON.stringify(parsedResponse))
                const tokenIds = parsedResponse.tokenIDs.map(item => item.split(':')[0]);
                console.log("getMintedNFTs tokenIds, ", JSON.stringify(tokenIds))
                setTotalAirdropNFTsMinted(tokenIds);
              }
            
            }
          });
        } catch (err) {
          console.log("error in calling GetAllMintedAirdropNFTs", err);
        }
        
      
    }
  const handleDrop = (index) => {
    const pos = getPosition(index, width);
    // matrix x and y are starting at 0, airdrop positions are starting at 1
    const droppedX = pos.x + 1
    const droppedY = pos.y + 1
    const droppedNFT = sourceGrid[indexSourceGrid]
    const droppedNFTX = droppedNFT.metadata.airdropXPos
    const droppedNFTY = droppedNFT.metadata.airdropYPos
    //console.log("dropped NFT ", JSON.stringify(droppedNFT))
    //console.log("dropped, aridropped ", droppedX, droppedY, droppedNFTX, droppedNFTY)
    if (droppedX != droppedNFTX || droppedY != droppedNFTY){
      alert("This doesn't quite belong there. Try other squares")
      // revert the dropped NFT if not correct
      handleClick(index)
    }
    else {
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
    }
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
    updatedCanvas.map( (nft, index) => {
      console.log("nft ", JSON.stringify(nft, null, 2))
        if(nft !== undefined && nft.metadata.tokenID != 0){
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

  // helper to determine the position in the matrix
  function getPosition(index, width){
    const x = index % width;
    const y = Math.floor(index / width);
    return { x: x, y: y };
  }

  // UI intensive functions

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
      //console.log("makeArt, ", JSON.stringify(artPayload))
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
      alert("seems like you're logged out")
    }
  }


  const handleNext = () => {
    // reset canvas
    setCanvas(Array(gridWidth*gridHeight).fill(placeHolderNFT));
    
    setCurrentImageIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      if (newIndex >= images.length - 1) {
        setIsNextDisabled(true);
      }
      setIsPrevDisabled(false);
      return newIndex;
    });
    setCurrentNFTIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      const filteredArray = totalNFTsMinted.filter(item => item.metadata.airdropParentID === airdropCompositeNFTs[newIndex]);
      setAvailableForParent(filteredArray);
      setSourceGrid(filteredArray);
      return newIndex;
    });
    
  };

  const handlePrev = () => {
    // reset canvas
    setCanvas(Array(gridWidth*gridHeight).fill(placeHolderNFT));
    
    setCurrentImageIndex(prevIndex => {
      const newIndex = prevIndex - 1;
      if (newIndex <= 0) {
        setIsPrevDisabled(true);
      }
      setIsNextDisabled(false);
      return newIndex;
    });
    setCurrentNFTIndex(prevIndex => {
      const newIndex = prevIndex - 1;
      const filteredArray = totalNFTsMinted.filter(item => item.metadata.airdropParentID === airdropCompositeNFTs[newIndex]);
      setAvailableForParent(filteredArray);
      setSourceGrid(filteredArray);
      return newIndex;
    });
    
  };

  return (
    <div className='flex items-center' style={{marginTop: 5, marginBottom: 20, flexDirection: 'column'}}>     
      <div className='flex justify-center items-center column' style={{flexDirection: 'column', position: 'relative'}}>
      <div className='flex justify-start items-start mt-4 row w-full'>  
      
      <SwitchButton setAssistiveImage={setAssistiveImage} assistiveImage={assistiveImage} />
      </div>
      <div style={{
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start', // Centers items vertically
        width: "100%"
    }}>
        <VStack w="55vh">
          <div style={{ 
              display: 'inline-grid', 
              background: 'gray',
              gridTemplateColumns: `repeat(${gridWidth}, 1fr)`, 
              gridTemplateRows: `repeat(${gridHeight}, 1fr)`, 
              gridGap: '0.5px', 
              border: '0.5px dashed #cdcdcd', 
              position: 'relative',
            }}>
              {renderCanvas()}
              {assistiveImage &&
                <img src={images[currentImageIndex]}  alt="helper" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.3, // Semi-transparent
                pointerEvents: 'none' // Allows clicks to pass through to the grid
                }}/>
              }
          </div>
          {height <= 2 &&
        <Text fontSize='xs' style={{paddingTop: 10, paddingLeft: 30, paddingRight: 30, paddingBottom: 15}}>
          Looks like you are on the minimum canvas size. There must be more basic NFT minted for a larger size. Read more <Link color='teal.500' href='/docs'>here</Link>.  
        </Text>
        }
        {height > 2 && height <=7 &&
        <Text fontSize='xs' style={{paddingTop: 10, paddingLeft: 30, paddingRight: 30, paddingBottom: 15}}>
          You are not playing on the maximum canvas size. Read more <Link as={NextLink} color='teal.500' href='/docs'>here</Link>.  
        </Text>
        }
        {height > 7 &&
        <Text fontSize='xs' style={{paddingTop: 10, paddingLeft: 30, paddingRight: 30, paddingBottom: 15}}>
          You are playing on the maximum canvas size, your art will have the best resolution.  
        </Text>
        }
        </VStack>
        
          <VStack style={{ marginLeft: 20}}>
            <a onClick={() => setAssistiveImage(true)}>
              <img src={images[currentImageIndex]} alt="helper" style={{
                width: '380px',
                height: '380px',
              }}/>
            </a>
          <HStack>
          <Button onClick={handlePrev} isDisabled={isPrevDisabled}>
              <FaArrowLeft />
          </Button>
          <Button onClick={handleNext} isDisabled={isNextDisabled}>
              <FaArrowRight />
          </Button>
          </HStack>
          </VStack>
        
      </div>
        
      </div>
      
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
          mb={4}
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
          <Link href={'/inventory'} passHref>
          <Button 
            disabled={false}
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
          </Link>
          </VStack>
        </Box>
      }
    
      </div>
         
        {isLoading &&
          <Box display="flex" justifyContent="center" width="100%" height="100%" mt={20}>
            <Spinner loadingText={'loading...'}/>
          </Box>
        }
        {!isLoading && sourceGrid !== undefined &&
          <AirdropData 
          totalNFTsMinted={totalAirdropNFTsMinted.length} 
          avaialableForParent={avaialableForParent.length}
          totalNeededForParent={totalNeededForParent} 
          /> 
        }
        {(!isLoading && sourceGrid !== undefined && sourceGrid.length !== 0) && 
          <Box borderWidth="0.5px" 
              borderColor="#ececec"
              borderRadius="lg" 
              h="30vh"
              overflowY="auto"
              style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(18, 1fr)', gridGap: '3px' }}>             
            { sourceGrid.map((nft, index) => (
              <CanvasGridItem key={index} nft={nft} onDragStart={() => handleDragStart(index)} /> 
              )
            )}
          </Box>
        }
        {(!isLoading && sourceGrid.length === 0) && 
          <Box borderWidth="0.5px" 
          borderColor="#ececec"
          borderRadius="lg" 
          h="30vh"
          w="100vh">  
          <Flex 
            height="100%" 
            justifyContent="center" 
            alignItems="center"
          >
            </Flex>
          </Box>
        }
        
      
      
    </div>
  );
};

export default AirdropCanvas;
