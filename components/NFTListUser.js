import SmallTile from './SmallTile'  
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import Link from 'next/link';
import Spinner from '../components/Spinner';
import Tile from './Tile';


const NFTListUser = ({userNFTs, isLoadingUserNFTs, userArtworkNFTs, isLoadingUserArtworkNFTs}) => {

  console.log("isLoadingUserNFTs", isLoadingUserNFTs)
 
  const renderNFTs = () => {
    if (userNFTs !== undefined && userNFTs.length !== 0) {
      return (
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridGap: "10px", padding: "20px" }}>
          {userNFTs.map((nft, index) => (
            <li key={index}>
              <Tile tokenId={nft.tokenId} metadata={JSON.stringify(nft)} />
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="flex justify-center">
  
    <div className="flex">
      <div className="w-1/1 p-4">
        <h1 className="text-2xl font-bold mb-2">Ready to use</h1>
        <h3 className="text-sm">These are the tiles you discovered so far. They all have 1 FLIP token inside,
        but must be used in an artwork project for the token to be unlocked and sent to you.</h3>
        <Box 
          maxW="fitcontent" 
          h="100vh"
          mt="4" 
          overflow="hidden"  
          display="flex"
          flexDirection="column"
          alignItems="flex-start">
          {isLoadingUserNFTs &&
            <Box display="flex" justifyContent="center" width="100%" mt={8}>
              <Spinner loadingText={'Fetching ready to use NFTs...'}/>
            </Box>
          }
        {!isLoadingUserNFTs && renderNFTs()}
        {(!isLoadingUserNFTs && userNFTs.length === 0) &&
            <Box display="flex" justifyContent="center" width="100%" mt={8}>
            <VStack p="6">
              <Text fontSize="lg" fontWeight="bold" textAlign="center">
                There's nothing here...
              </Text>
              <Link href={'/flip'} passHref>
                <Button as="a" borderRadius="full">
                  Go flip some!
                </Button>
              </Link>
              </VStack>
            </Box>
          }
        </Box>
      </div>
    </div>
  
</div>
  );
  
};

export default NFTListUser;
