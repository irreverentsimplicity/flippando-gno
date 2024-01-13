// GridLayout.js
import { Grid } from '@chakra-ui/react';
import ListingCard from './ListingCard';

const MarketPlaceGrid = ({ listings, playerAddress }) => {
    console.log("cards in MarketPlaceGrid ", JSON.stringify(listings))
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={10}>
      {listings.map((listingData, index) => (
        <ListingCard key={index} 
            artwork={listingData} 
            seller={listingData.seller} 
            playerAddress={playerAddress}
            price={listingData.price}
            numCols={2}/>
      ))}
    </Grid>
  );
};

export default MarketPlaceGrid;
