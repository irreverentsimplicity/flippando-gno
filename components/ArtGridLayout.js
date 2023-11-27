// GridLayout.js
import { Grid } from '@chakra-ui/react';
import ArtCard from './ArtCard';

const ArtGridLayout = ({ cards }) => {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={10}>
      {cards.map((cardData, index) => (
        <ArtCard key={index} 
            artwork={cardData} 
            title="Flippando" 
            text="version 1.0.0"
            numCols={cardData.canvasWidth}/>
      ))}
    </Grid>
  );
};

export default ArtGridLayout;
