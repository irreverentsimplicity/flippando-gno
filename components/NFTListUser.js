import SmallTile from './SmallTile'  
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import Link from 'next/link';
import Spinner from '../components/Spinner';


const NFTListUser = ({userNFTs, isLoadingUserNFTs, userArtworkNFTs, isLoadingUserArtworkNFTs}) => {

  
 
  const renderNFTs = () => {
    if (userNFTs !== undefined && userNFTs.length !== 0) {
      return (
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridGap: "10px", padding: "20px" }}>
          {userNFTs.map((nft, index) => (
            <li key={nft.tokenId}>
              <SmallTile tokenId={nft.tokenId} metadata={JSON.stringify(nft)} />
            </li>
          ))}
        </ul>
      );
    }
  };


  const renderUsedNFTs = () => {
    if (userArtworkNFTs !== undefined && userArtworkNFTs.length !== 0) {
      return (
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridGap: "10px", padding: "20px" }}>
          {userArtworkNFTs.map((nft, index) => (
            <li key={nft.tokenId}>
              <SmallTile tokenId={nft.tokenId} metadata={JSON.stringify(nft)} />
            </li>
          ))}
        </ul>
      );
    }
  };
  

  return (
    <div className="flex justify-center">
  
    <div className="flex">
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-bold mb-2">Ready to use</h1>
        <h3 className="text-sm">These are the tiles you discovered so far. They all have 1 FLIP token inside,
        but must be used in an artwork project for the token to be unlocked and sent to you.</h3>
        <Box 
          maxW="lg" 
          h="100vh"
          mt="4" 
          borderWidth="1px" 
          borderRadius="lg" 
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
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-bold mb-2">Part of artwork</h1>
        <h3 className="text-sm">These are NFTs already used to create your artwork. They cannot be transfered individually
        and their FLIP tokens have been unlocked and transferred to their initial creators. </h3>
        <Box 
          maxW="lg" 
          h="100vh" 
          mt="4"
          borderWidth="1px" 
          borderRadius="lg" 
          overflow="hidden"  
          display="flex"
          flexDirection="column"
          alignItems="flex-start">
          {isLoadingUserArtworkNFTs &&
            <Box display="flex" justifyContent="center" width="100%" mt={8}>
              <Spinner loadingText={'Fetching NFTs part of artwork'}/>
            </Box>
          }
          {!isLoadingUserArtworkNFTs && renderUsedNFTs()}
          {(!isLoadingUserArtworkNFTs && userArtworkNFTs.length === 0) &&
            <Box display="flex" justifyContent="center" width="100%" mt={8}>
            <VStack p="6">
              <Text fontSize="lg" fontWeight="bold" textAlign="center">
                There's nothing here...
              </Text>
              <Link href={'/playground'} passHref>
                <Button as="a" borderRadius="full">
                  Make some art
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
