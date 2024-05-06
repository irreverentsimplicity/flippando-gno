/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import SmallTile from '../components/SmallTile';
import { Box, Text, Link, Switch, FormControl, FormLabel } from "@chakra-ui/react";
import NextLink from 'next/link';
import Spinner from './Spinner';
import { setArtPayload } from '../slices/flippandoSlice';
import Loader from '../pages/assets/loader.svg';
//import Hacker from '../pages/assets/hacker_pixelated_64.jpeg'
import Actions from '../util/actions';


const Square = ({ isOccupied, onDrop, onClick, nft, canAcceptDrop, index }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'image', // Specify the types of items accepted
    drop: canAcceptDrop ? onDrop : null, // Only call onDrop if canAcceptDrop is true
    collect: monitor => ({
      isOver: canAcceptDrop && monitor.isOver(), // Only show isOver effect if can accept drop
    }),
  }), [canAcceptDrop, onDrop]); // React to changes in canAcceptDrop and onDrop

  // Convert NFT metadata to a string for display, assuming you need it as a prop for SmallTile
  const stringifiedNFT = JSON.stringify(nft?.metadata);
  return (
    <div
      onClick={canAcceptDrop ? onClick: null}
      ref={drop} // Use the ref from useDrop to make this div a drop target
      style={{
        width: '38px',
        height: '38px',
        border: '0.5px solid #eee',
        background: isOver ? 'lightgreen' : canAcceptDrop ? 'white' : '#bbb', // Highlight on hover if over a droppable area
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isOccupied && <div><SmallTile metadata={stringifiedNFT} tokenId={nft.tokenId} /></div>}
      {/*(nft === null || nft === undefined) && !isOccupied && <div><Color7/></div>*/}
      {/*isOccupied && nft && <SmallTile metadata={stringifiedNFT} tokenId={nft.tokenId} />*/}
      {/*(!nft || !isOccupied) && <Color7 />*/}
    </div>
  );
};

const GridItem = ({ onDragStart, nft }) => {
    const stringifiedNFT = JSON.stringify(nft.metadata);
  const [{ isDragging }, drag] = useDrag({
    item: { },
    type: 'image',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      onDragStart={onDragStart}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '2px',
        width: '45px',
        height: '45px',
        border: '1px dashed #ccc',
        background: isDragging ? 'lightblue' : 'white',
        cursor: 'move',
      }}
    >
      { nft !== undefined && nft.metadata.image !== 'i' ? 
      <SmallTile metadata={stringifiedNFT} tokenId={nft.tokenId} /> : null}
    </div>
  );
};

const Canvas = ({height, width, isArtMinted}) => {

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
    const [assistiveMode, setAssistiveMode] = useState(false);
    const [assistiveImage, setAssistiveImage] = useState(false);
    const dispatch = useDispatch();

    // Calculate start and end for draggable area
    const startRow = Math.floor((gridHeight - height) / 2);
    const endRow = startRow + height;
    const startCol = Math.floor((gridWidth - width) / 2);
    const endCol = startCol + width;
    
    useEffect(() => {
        console.log("fetchNFTs")
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
          
        };
    
        fetchNFTs();;
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
          <Square
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

  return (
    <div className='flex items-center' style={{marginTop: 20, marginBottom: 20, flexDirection: 'column'}}>     

<div className='flex justify-center items-center column' style={{flexDirection: 'column', position: 'relative'}}>
<div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "flex-end" }}>
<FormControl display='flex' alignItems='center' style={{ width: 'auto' }}>
  <FormLabel htmlFor='assistive-mode' mb='2' fontSize='xs'>
    Assistive Mode
  </FormLabel>
  <Switch size='md' id='assistive-mode' mb='2' onChange={(event) => {
    setAssistiveMode(event.target.checked)
    setAssistiveImage(false)
  }
  }/>
</FormControl>
</div>
<div style={{
    display: "flex",
    flexDirection: 'row',
    justifyContent: assistiveMode ? 'flex-start' : 'center', // Adjust based on assistiveMode
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
              {assistiveImage && assistiveMode &&
                <img src="/assets/hacker_pixelated_64.jpeg" alt="helper" style={{
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
        
        {assistiveMode &&
          <div style={{marginLeft: 10}}>
            <a onClick={() => setAssistiveImage(true)}>
           <img src="/assets/hacker_pixelated_64.jpeg" alt="helper" style={{
            width: '309px',
            height: '309px',
          }}/>
          </a>
          </div>
        }
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
            <GridItem key={index} nft={nft} onDragStart={() => handleDragStart(index)} /> 
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

export default Canvas;
