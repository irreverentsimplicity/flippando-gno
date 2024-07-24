import { useDrag } from 'react-dnd';
import CanvasTile from './CanvasTile';

const CanvasGridItem = ({ onDragStart, nft }) => {
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
        width: '52px',
        height: '52px',
        border: '0.5px dashed #ccc',
        background: isDragging ? 'lightblue' : 'white',
        cursor: 'move',
      }}
    >
      { nft !== undefined && nft.metadata.image !== 'i' ? 
      <CanvasTile metadata={stringifiedNFT} tokenId={nft.tokenId} /> : null}
    </div>
  );
};

export default CanvasGridItem;