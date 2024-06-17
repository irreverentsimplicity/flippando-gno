// GridLayout.js
import { Grid } from '@chakra-ui/react';
import ListingCard from './ListingCard';

const MarketPlaceGrid = ({ listings, playerAddress, triggerReload }) => {
    //console.log("cards in MarketPlaceGrid ", JSON.stringify(listings))
    const handleReload = () => {
      triggerReload()
    }
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={10}>
      {listings.map((listingData, index) => (
        <ListingCard key={index} 
            artwork={listingData} 
            seller={listingData.seller} 
            playerAddress={playerAddress}
            onRemoveListing={handleReload}
            onBuy={handleReload}
            price={listingData.price/1000}
            numCols={2}/>
      ))}
    </Grid>
  );
};

export default MarketPlaceGrid;
