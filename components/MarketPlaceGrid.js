// GridLayout.js
import { Grid } from '@chakra-ui/react';
import ListingCard from './ListingCard';
import BasicListingCard from './BasicListingCard';

const MarketPlaceGrid = ({ marketType, listings, playerAddress, triggerReload }) => {
    //console.log("cards in MarketPlaceGrid ", JSON.stringify(listings))
    const handleReload = () => {
      triggerReload()
    }
  return (
    <div>
    
      {marketType === "art" &&
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
      }
      
      {marketType === "basic" &&
        <Grid templateColumns="repeat(3, 1fr)" gap={10}>
          {listings.map((listingData, index) => (
          <BasicListingCard key={index} 
              cardData={listingData} 
              seller={listingData.seller} 
              playerAddress={playerAddress}
              onRemoveListing={handleReload}
              onBuy={handleReload}
              price={listingData.price/1000}
              numCols={2}/>
        ))}
        </Grid>
      }
      </div>
    
    
  );
};

export default MarketPlaceGrid;
