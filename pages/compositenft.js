import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/Home.module.css";
import Menu from "../components/Menu";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box, Text, VStack, HStack, Button, Tabs, Tab, TabList, TabPanels, TabPanel, Link, Divider } from "@chakra-ui/react";
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";
import Actions from '../util/actions';

const ArtSmallTile = ({ size, artNFT, tokenID }) => {
    //console.log("svgData", JSON.stringify(artNFT))
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        margin: "0px",
        border: "0px",
        width: size,
        height: size,
        backgroundColor: 'white', // Resets background color
      }}>
        <img src={"data:image/svg+xml;base64," + artNFT.svgData} alt={tokenID} />
      </div>
    );
  };

// @TODO update this component for a composite nft, right now it's just a copy of basic nft
const CompositeNFT = () => {

  const userArtNFTs = useSelector(state => state.flippando.userArtNFTs);
  const userBalances = useSelector(state => state.flippando.userBalances);
  const userGnotBalances = useSelector(state => state.flippando.userGnotBalances);
  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);
  const [artNFT, setArtNFT] = useState(null)
  const [artNFTData, setArtNFTData] = useState([])
  const imageWidth = 300; // Fixed image width
  const [tileSize, setTileSize] = useState("0")
  const [flipUnlocked, setFlipUnlocked] = useState(null)

  const dispatch = useDispatch()
  const router = useRouter();
  const { tokenId } = router.query;
  console.log("tokenId ", tokenId)
  

  useEffect( () => {
      console.log("rpcEndpoint in useEffect, my-flips.js ", rpcEndpoint)
      getGNOTBalances(dispatch, (result) => {
        if (result.success) {
            alert(result.message);
        } else {
            alert(`Error: ${result.message}`);
        }
    });
      fetchUserFLIPBalances(dispatch);
  }, [rpcEndpoint, dispatch])

  useEffect( () => {
        getArtNFTData()
  }, [tokenId])

  const getArtNFTData = async () => {
    if (tokenId){
        const filteredByToken = userArtNFTs.filter(item => item.tokenID === tokenId);
        if(filteredByToken.length !== 0){
            console.log("artNFT ", JSON.stringify(filteredByToken[0]))
            setArtNFT(filteredByToken[0])
            setTileSize(imageWidth / filteredByToken[0].canvasWidth)
            console.log("artNFT ", JSON.stringify(filteredByToken[0]))
            const actions = await Actions.getInstance();
            const bTokenIds = JSON.stringify(filteredByToken[0].bTokenIDs);
            try {
                const response = await actions.getArtworkNFTs(bTokenIds);
                const parsedResponse = JSON.parse(response);
                if (!parsedResponse.error) {
                    console.log("getArtworkNFTs, ", JSON.stringify(parsedResponse))
                    setArtNFTData(parsedResponse.userNFTs)
                    let flips = 0
                    parsedResponse.userNFTs.map((basicNFT, index) => {
                        if(basicNFT.gameLevel == "16"){
                            flips += 1
                        }
                        else if(basicNFT.gameLevel == "64"){
                            flips += 4
                        }
                    })
                    setFlipUnlocked(flips)
                } else {
                    console.log("error retrieving artwork nfts ", JSON.stringify(parsedResponse.error))
                }
            } catch (error) {
                console.error('Error retrieving basic NFTs for composite NFT:', error);
            }
        }
    }
  }

  const handleNavigation = () => {
    router.push('/inventory')
  }

  return (

    <div className={styles.container}>
  <Header userBalances={userBalances} userGnotBalances={userGnotBalances} />

  <div className="grid grid-cols-5">
    
    <div className="bg-white-100 col-span-1">
      <Menu />
    </div>   

    {artNFT !== null && (
      <div className="col-span-4">
        <Tabs variant="enclosed-colored" borderColor={"purple.200"} paddingBottom={4}>
          <TabList justifyContent={"flex-end"}>
            <Tab
              bg="purple.400"
              _selected={{ bg: "purple.900", color: "white" }}
              _hover={{ bg: "purple.700", color: "white" }}
              _active={{ color: "purple.700" }}
              color="purple.900"
              fontWeight="bold"
            >
              <HStack spacing={4}>
                <span>Details</span>
              </HStack>
            </Tab>
            
            
          </TabList>

        </Tabs>
        <div className='grid grid-cols-2'>
          <div className="flex justify-end pr-4">
            <Box
              display="flex"
              flexDirection="row"
              maxW="sm"
              maxH="570px"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              alignItems="flex-end"
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', width: `${imageWidth}px` }}>
                {artNFTData !== undefined && artNFTData.map((basicNFT, index) => (
                <ArtSmallTile key={basicNFT.tokenID} size={`${tileSize}px`} artNFT={basicNFT} tokenID={basicNFT.tokenID} />
                ))}
            </div>
            </Box>
          </div>

          <div>
            <Box display="flex" flexDirection="column">
              <VStack p="2">
                <VStack width="100%" alignItems="flex-start" spacing={2} >
                <HStack>
                  <Text fontWeight="500" lineHeight="tight" isTruncated>Name:</Text> 
                  <Text fontWeight="200" lineHeight="tight" isTruncated>{artNFT.name}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="500" lineHeight="tight" isTruncated>Version:</Text> 
                  <Text fontWeight="200" lineHeight="tight" isTruncated>{artNFT.version}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="500" lineHeight="tight" isTruncated>Components:</Text> 
                  <Text fontWeight="200" lineHeight="tight" isTruncated>
                    { (artNFT.canvasHeight !== null && artNFT.canvasWidth !== null) && 
                    <div>
                        {(artNFT.canvasHeight * artNFT.canvasWidth)} flips, ({artNFT.canvasHeight} x {artNFT.canvasWidth} matrix)
                    </div>
                    }
                  </Text>
                </HStack>  
                <HStack>
                  <Text fontWeight="500" lineHeight="tight" isTruncated>$FLIP unlocked:</Text> 
                  <Text fontWeight="200" lineHeight="tight" isTruncated>{flipUnlocked !== null ? flipUnlocked : "unknown" }</Text>
                </HStack>  
                {artNFT.gameType === 'airdrop' &&
                <Box 
                    display="flex"
                    flexDirection="column"
                    width="100%"
                    padding={4}
                    marginTop={3}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    alignItems="flex-start">
                  <HStack mb={1}>
                    <Text fontWeight="500" lineHeight="tight" isTruncated>Airdrop name:</Text> 
                    <Text fontWeight="200" lineHeight="tight" isTruncated>{artNFT.airdropName}</Text>
                  </HStack>  
                  <HStack mb={1}>
                    <Text fontWeight="500" lineHeight="tight" isTruncated>Airdrop parent token ID:</Text> 
                    <Text fontWeight="200" lineHeight="tight" isTruncated>{artNFT.airdropParentID}</Text>
                  </HStack>  
                  <HStack mb={1}>
                    <Text fontWeight="500" lineHeight="tight" isTruncated>X position in parent:</Text> 
                    <Text fontWeight="200" lineHeight="tight" isTruncated>{artNFT.airdropXPos}</Text>
                  </HStack>  
                  <HStack mb={1}>
                    <Text fontWeight="500" lineHeight="tight" isTruncated>Y position in parent:</Text> 
                    <Text fontWeight="200" lineHeight="tight" isTruncated>{artNFT.airdropYPos}</Text>
                  </HStack>  
                </Box>
                }
                  
                </VStack>
              </VStack>
            </Box>
          </div>
        </div>
        <div className='col-span-4 flex justify-center mt-4'>
            <Divider/>
        </div>
        <div className='col-span-4 flex justify-center mt-4'>
          <Box width="100%" textAlign="center">
            
              <Button
                bg="purple.900"
                color="white"
                _hover={{ bg: "blue.600" }}
                borderRadius="full"
                onClick={handleNavigation}
              >
                Inventory
              </Button>
            
          </Box>
        </div>
      </div>
    )}

    <div className="col-span-5 pt-20">
      <Footer />
    </div>
  </div>
</div>

  );
}

export default CompositeNFT;