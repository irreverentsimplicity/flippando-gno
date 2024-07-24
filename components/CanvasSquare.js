import { useDrop } from 'react-dnd';
import CanvasTile from './CanvasTile';

const CanvasSquare = ({ isOccupied, onDrop, onClick, nft, canAcceptDrop, index }) => {
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
          width: '52px',
          height: '52px',
          border: '1px solid #efefef',
          background: isOver ? 'lightblue' : canAcceptDrop ? 'white' : '#bbb', // Highlight on hover if over a droppable area
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isOccupied && <div><CanvasTile metadata={stringifiedNFT} tokenId={nft.tokenId} /></div>}
        {/*(nft === null || nft === undefined) && !isOccupied && <div><Color7/></div>*/}
        {/*isOccupied && nft && <SmallTile metadata={stringifiedNFT} tokenId={nft.tokenId} />*/}
        {/*(!nft || !isOccupied) && <Color7 />*/}
      </div>
    );
  };

  export default CanvasSquare;