import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import SmallTile from '../components/SmallTile';
import Color7 from '../pages/assets/squares/Color7.svg';
import { Box } from "@chakra-ui/react";

import { setArtPayload } from '../slices/flippandoSlice';
import Loader from '../pages/assets/loader.svg';
import Actions from '../pages/util/actions';

const Square = ({ isOccupied, onDrop, onClick, nft }) => {
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

const Canvas = ({height, width}) => {
    const placeHolderNFT = {tokenId: 0, metadata: {image: 'i'}};
    const [sourceGrid, setSourceGrid] = useState([]);
    const [canvas, setCanvas] = useState(Array(height*width).fill(placeHolderNFT));
    const [indexSourceGrid, setIndexSourceGrid] = useState(null);
    const [indexTrack, setIndexTrack] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

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
                  setIsLoading(false);
                  setSourceGrid(nftData);
                }
              }
            });
          } catch (err) {
            console.log("error in calling getAllNFTs", err);
          }
          
        };
    
        fetchNFTs();;
      }, []);

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
    /*
    else {
      alert("You have to fill the entire canvas")
    }*/
  }

  return (
    <div className='flex items-center' style={{marginTop: 20, marginBottom: 20, flexDirection: 'column'}}>
            
      <div style={{ marginRight: '20px' }}>
        
         <Box 
          width="100%" 
          height="80%"
          mt="4" 
          borderWidth="1px" 
          borderRadius="lg" 
          overflow="hidden"  
          display="grid"
          flexDirection="column"
          alignItems="flex-start">
        {isLoading &&
            <div className="flex justify-center items-center"><Loader width={45} height={45}/></div>
        }
        <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(18, 1fr)', gridGap: '3px' }}>  
          { (sourceGrid !== undefined && isLoading === false) && sourceGrid.map((nft, index) => (
            <GridItem key={index} nft={nft} onDragStart={() => handleDragStart(index)} /> 
            )
          )}
        </div>
        </Box>
      </div>
      <div className='flex justify-center items-center column' style={{flexDirection: 'column'}}>
        <div className='text-sm pt-3 pb-5 text-center' style={{width: '75%'}}>
          Drag and drop squares from above into your canvas below. Click on a tile in the canvas to remove it. When your're finished, click Make Art.
        </div>
        
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
    </div>
  );
};

export default Canvas;
