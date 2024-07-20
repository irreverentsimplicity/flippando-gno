// GridLayout.js
import { Grid } from '@chakra-ui/react';
import BasicNFTCard from './BasicNFTCard';

const BasicNFTGridLayout = ({ cards, onTrigger }) => {

  console.log('cards ', JSON.stringify(cards))
  
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={10}>
      {cards.map((cardData, index) => (
        <BasicNFTCard key={index} 
            cardData={cardData} 
            title="Flippando" 
            text="version 1.0.0"
            onTrigger={onTrigger}
            numCols={cardData.canvasWidth}/>
      ))}
    </Grid>
  );
};

export default BasicNFTGridLayout;
