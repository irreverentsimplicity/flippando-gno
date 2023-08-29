import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
//import {ethers} from 'ethers';
import SmallTile from '../components/SmallTile';
import Color7 from '../pages/assets/squares/Color7.svg';
import Flippando from '../artifacts/contracts/Flippando.sol/Flippando.json'
import { setArtPayload } from '../slices/flippandoSlice';
import Loader from '../pages/assets/loader.svg';

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
    const adr = useSelector(state => state.flippando.adr);
    const flippandoAddress = adr.flippandoAddress;
    const placeHolderNFT = {tokenId: 0, metadata: {image: 'i'}};
    const [sourceGrid, setSourceGrid] = useState([]);
    const [canvas, setCanvas] = useState(Array(height*width).fill(placeHolderNFT));
    const [indexSourceGrid, setIndexSourceGrid] = useState(null);
    const [indexTrack, setIndexTrack] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNFTs = async () => {
          // Connect to the Ethereum network
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(flippandoAddress, Flippando.abi, signer);
    
    
          // Call the getUserNFTs function from the smart contract
          //const tokenIds = await contract.getUserNFTs({ from: userAddress });
          const totalSupply = await contract.totalSupply();
          const tokenIds = [];
          // Get the current user's address
          const userAddress = await signer.getAddress();
          setIsLoading(true);
          for (let i = 0; i < totalSupply; i++) {
            const tokenId = await contract.tokenByIndex(i);
            const owner = await contract.ownerOf(tokenId);
            if (userAddress !== owner){
              tokenIds.push(tokenId);
              console.log(JSON.stringify(tokenId));
            }
          }
          // Retrieve tokenURI metadata for each NFT
          const nftData = await Promise.all(
            tokenIds.map(async (tokenId) => {
              const tokenUri = await contract.tokenURI(tokenId);
              const response = await fetch(tokenUri);
              const metadata = await response.text();
              //console.log("metadata " + metadata)
              
              if(metadata !== undefined && metadata !== null){
                return {
                  tokenId: tokenId.toString(),
                  metadata: JSON.parse(metadata),
                };
              }
            
            })
          );

          if(nftData.length !== 0){
            setIsLoading(false);
            setSourceGrid(nftData);
          }
        };
    
        fetchNFTs();
      }, []);

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
    
    console.log('updatedCanvas ' + JSON.stringify(updatedCanvas));
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
    let tokenIds = [];
    canvas.map( (nft, index) => {
        if(nft.tokenId !== 0){
            tokenIds.push(nft.tokenId);
        }
    });
    if (tokenIds.length === height*width){
        setArtPayload([height, width, tokenIds]);
    }
  }

  return (
    <div className='flex items-center' style={{marginTop: 20, marginBottom: 20, flexDirection: 'column'}}>
            
      <div style={{ marginRight: '20px' }}>
        {/* <h2 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Available NFTs</h2> */}
        <div className='flex justify-center items-center text-2xl font-medium font-quantico pt-1'><p>Available for painting</p></div>
        {isLoading &&
            <div className="flex justify-center items-center"><Loader width={45} height={45}/></div>
        }
        <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(10, 1fr)', gridGap: '3px' }}>  
          { (sourceGrid !== undefined && isLoading === false) && sourceGrid.map((nft, index) => (
            <GridItem key={index} nft={nft} onDragStart={() => handleDragStart(index)} /> 
            )
          )}
        </div>
      </div>
      <div>
        {/* <h2 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Your Canvas</h2> */}
        <div className='flex justify-center items-center text-2xl font-medium font-quantico pt-3'><p>Your canvas</p></div>
        <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(4, 1fr)', gridGap: '0px', border: '1px dashed #ccc' }}>
          {canvas.map((nft, index) => (
            <Square
              key={index}
              onClick={() => handleClick(index)}
              isOccupied={nft.tokenId === 0 ? false : true}
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
