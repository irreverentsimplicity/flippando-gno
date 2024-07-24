/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import SmallTile from './SmallTile';
import { Box, Text, Link, Switch, FormControl, FormLabel } from "@chakra-ui/react";
import NextLink from 'next/link';
import Spinner from './Spinner';
import { setArtPayload } from '../slices/flippandoSlice';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Loader from '../pages/assets/loader.svg';
import Actions from '../util/actions';
import CanvasGridItem from './CanvasGridItem';
import CanvasSquare from './CanvasSquare';
import SwitchButton from './SwitchButton';



const AdvancedCanvas = ({height, width, isArtMinted}) => {

    // Constants for the 8x8 grid
    const gridWidth = 8;
    const gridHeight = 8;

    const placeHolderNFT = {tokenId: 0, metadata: {image: 'i'}};
    const [sourceGrid, setSourceGrid] = useState([]);
    const [canvas, setCanvas] = useState(Array(height*width).fill(placeHolderNFT));
    const [gridCanvas, setGridCanvas] = useState(Array(gridWidth*gridHeight).fill(placeHolderNFT));
    const [indexSourceGrid, setIndexSourceGrid] = useState(null);
    const [indexTrack, setIndexTrack] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);
    //const [assistiveMode, setAssistiveMode] = useState(false);
    const [assistiveImage, setAssistiveImage] = useState(false);
    const dispatch = useDispatch();

    // Calculate start and end for draggable area
    const startRow = Math.floor((gridHeight - height) / 2);
    const endRow = startRow + height;
    const startCol = Math.floor((gridWidth - width) / 2);
    const endCol = startCol + width;

    // used for assitive image array
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = ["/assets/hacker_pixelated_64.jpeg", "/assets/hacker_green_pixelated_64.jpeg"];
    
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
                    nftData.push({
                      tokenId: nftItem.tokenId,
                      metadata: nftItem,
                    });
                  });
                } else {
                  parsedResponse.userNFTs.forEach((nftItem) => {
                    nftData.push({
                      tokenId: nftItem.tokenId,
                      metadata: nftItem,
                    });
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
    
      fetchNFTs();
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
    updatedCanvas.map( (nft, index) => {
      console.log("nft ", JSON.stringify(nft, null, 2))
        if(nft.tokenId != 0){
            tokenIds.push(nft.metadata.tokenID);
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

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className='flex items-center' style={{marginTop: 5, marginBottom: 20, flexDirection: 'column'}}>     
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "flex-start" }}>
    <SwitchButton setAssistiveImage={setAssistiveImage} />
    </div>
<div className='flex justify-center items-center column' style={{flexDirection: 'column', position: 'relative'}}>

      <div style={{
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center', // Centers items vertically
        width: "100%"
    }}>
        
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
        
        
          <div style={{ marginLeft: 10}}>
            <a onClick={() => setAssistiveImage(true)}>
           <img src={images[currentImageIndex]} alt="helper" style={{
            width: '404px',
            height: '404px',
          }}/>
          </a>
          <button style={{
              position: 'absolute',
              top: '50%',
              left: 320,
              transform: 'translateY(-50%)'
          }} onClick={handlePrev}>
              <FaArrowLeft />
          </button>
          <button style={{
              position: 'absolute',
              top: '50%',
              right: 2,
              transform: 'translateY(-50%)'
          }} onClick={handleNext}>
              <FaArrowRight />
          </button>
          </div>
        
      </div>
          {height <= 2 &&
          <Text fontSize='xs' style={{paddingTop: 20}}>
            You are on the minimum canvas size. There must be more basic NFT minted for a larger size. Read more <Link as={NextLink} color='teal.500' href='/docs'>here</Link>.  
          </Text>
          }
          {height > 2 && height <=7 &&
          <Text fontSize='xs' style={{paddingTop: 20}}>
            You are not playing on the maximum canvas size. Read more <Link as={NextLink} color='teal.500' href='/docs'></Link>.  
          </Text>
          }
          {height > 7 &&
          <Text fontSize='xs' style={{paddingTop: 20}}>
            You are playing on the maximum canvas size, your art will have the best resolution.  
          </Text>
          }
        </div>
      <div style={{ marginRight: '20px' }}>
        
         <Box 
           w="100vh" 
           h="30vh"
           mt="4" 
           borderWidth="1px" 
           borderRadius="lg" 
           overflow="hidden"  
           display="flex"
           flexDirection="column"
           alignItems="flex-start">
        {isLoading &&
          <Box display="flex" justifyContent="center" width="100%" height="100%" mt={20}>
            <Spinner loadingText={'loading...'}/>
          </Box>
        }
        <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(18, 1fr)', gridGap: '3px' }}>  
          { (sourceGrid !== undefined && !isLoading) && sourceGrid.map((nft, index) => (
            <CanvasGridItem key={index} nft={nft} onDragStart={() => handleDragStart(index)} /> 
            )
          )}
        </div>
        {(!isLoading && sourceGrid.length === 0) && 
            <Box display="flex" justifyContent="center" width="100%" height="100%" mt={20}>
            Nothing here yet.
            </Box>
          }
        </Box>
      </div>
      
    </div>
  );
};

export default AdvancedCanvas;
