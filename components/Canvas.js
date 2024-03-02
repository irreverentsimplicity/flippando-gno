import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import SmallTile from '../components/SmallTile';
import Color7 from '../pages/assets/squares/Color7.svg';
import { Box } from "@chakra-ui/react";
import Spinner from './Spinner';
import { setArtPayload } from '../slices/flippandoSlice';
import Loader from '../pages/assets/loader.svg';
import Actions from '../util/actions';


/*const Square = ({ isOccupied, onDrop, onClick, nft }) => {
    const stringifiedNFT = JSON.stringify(nft.metadata);
  const [{ isOver }, drop] = useDrop({
    accept: 'image',
    drop: () => onDrop(),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }); 

  return (
    <div onClick={onClick}
      ref={drop}
      style={{
        width: '38px',
        height: '38px',
        border: '0px solid #ccc',
        background: isOver ? 'lightblue' : 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isOccupied && <div><SmallTile metadata={stringifiedNFT} tokenId={nft.tokenId} /></div>}
      {(nft === null || nft === undefined) && !isOccupied && <div><Color7/></div>}
    </div>
  );
};*/

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
        background: isOver ? 'lightgreen' : canAcceptDrop ? 'white' : 'gray', // Highlight on hover if over a droppable area
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isOccupied && nft && <SmallTile metadata={stringifiedNFT} tokenId={nft.tokenId} />}
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
    const dispatch = useDispatch();

    // Calculate start and end for draggable area
    const startRow = Math.floor((gridHeight - height) / 2);
    const endRow = startRow + height;
    const startCol = Math.floor((gridWidth - width) / 2);
    const endCol = startCol + width;
    let realIndex = -1;


    useEffect(() => {
        console.log("fetchNFTs")
        const fetchNFTs = async () => {
            
          setIsLoading(true);

          const actions = await Actions.getInstance();
          const playerAddress = await actions.getWalletAddress();
          try {
            actions.getAllNFTs(playerAddress).then((response) => {
              console.log("getAllNFTS response in Canvas", response);
              let parsedResponse = JSON.parse(response);
              console.log("parseResponse", parsedResponse)
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
              console.log("getAllNFTS response in Canvas", response);
              let parsedResponse = JSON.parse(response);
              console.log("parseResponse", parsedResponse)
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
    console.log('updatedCanvas ' + JSON.stringify(updatedCanvas));
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
    updatedSourceGrid[idxTuple[0].gridIndex] = canvas[index];
    setSourceGrid(updatedSourceGrid);
    // empty canvas
    const updatedCanvas = [...canvas];
    updatedCanvas[index] = placeHolderNFT;
    setCanvas(updatedCanvas);

  }

  const checkAndPrepareArtPayload = (updatedCanvas) => {
    console.log("checkAndPrepare updatedCanvas " + JSON.stringify(updatedCanvas, null, 2))
    let tokenIds = [];
    updatedCanvas.map( (nft, index) => {
      console.log("nft ", JSON.stringify(nft, null, 2))
        if(nft.tokenId != 0){
            tokenIds.push(nft.metadata.tokenID);
        }
        
    });
    console.log("tokenIds ", JSON.stringify(tokenIds, null, 2))
    if (tokenIds.length === (height*width)){
        console.log("canvas filled")
        dispatch(setArtPayload([height, width, tokenIds]));
    }
  }

  return (
    <div className='flex items-center' style={{marginTop: 20, marginBottom: 20, flexDirection: 'column'}}>
            {/* 
            <div className='flex justify-center items-center column' style={{flexDirection: 'column'}}>
        
        
        <div style={{ 
          display: 'inline-grid', 
          gridTemplateColumns: `repeat(${width}, 1fr)`, 
          gridTemplateRows: `repeat(${height}, 1fr)`, 
          gridGap: '0px', 
          border: '1px dashed #ccc' 
        }}>
          {canvas.map((nft, index) => (
            <Square
              key={index}
              onClick={() => handleClick(index)}
              isOccupied={nft.tokenId !== 0}
              nft={nft}
              onDrop={() => handleDrop(index)}
            />
          ))}
        </div>

      </div>
            */}

<div className='flex justify-center items-center column' style={{flexDirection: 'column'}}>
          <div style={{ 
            display: 'inline-grid', 
            background: 'gray',
            gridTemplateColumns: `repeat(${gridWidth}, 1fr)`, 
            gridTemplateRows: `repeat(${gridHeight}, 1fr)`, 
            gridGap: '0.5px', 
            border: '0.5px dashed #cdcdcd', 
          }}>
            {gridCanvas.map((nft, index) => {
              const row = Math.floor(index / gridWidth);
              const col = index % gridWidth;
              const canAcceptDrop = row >= startRow && row < endRow && col >= startCol && col < endCol;
              if (canAcceptDrop) {
                realIndex++;
              }
              
              console.log("index, " + index + ", realIndex, " + realIndex + ", canAcceptDrop " + canAcceptDrop)
              return (
                <Square
                  key={index}
                  index={realIndex}
                  onClick={() => handleClick(realIndex)}
                  isOccupied={nft.tokenId !== 0}
                  nft={nft}
                  onDrop={() => handleDrop(index)}
                  canAcceptDrop={canAcceptDrop}
                />
              );
            })}
          </div>
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
