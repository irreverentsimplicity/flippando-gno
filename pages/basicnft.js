import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/Home.module.css";
import Menu from "../components/Menu";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box, Text, VStack, HStack, Button, Tabs, Tab, TabList, TabPanels, TabPanel, Link, Divider } from "@chakra-ui/react";
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";

const BasicNFTSmallTile = ({ size, basicNFT, tokenID }) => {
    console.log("basicNFT", JSON.stringify(basicNFT))
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
        <img src={"data:image/svg+xml;base64," + basicNFT.svgData} alt={tokenID} />
      </div>
    );
  };

const BasicNFT = () => {

  const userBasicNFTs = useSelector(state => state.flippando.userBasicNFTs);
  const userBalances = useSelector(state => state.flippando.userBalances);
  const userGnotBalances = useSelector(state => state.flippando.userGnotBalances);
  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);
  const [basicNFTData, setBasicNFTData] = useState(null)
  const imageWidth = 400; // Fixed image width
  const tileSize = 400; 

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
        getBasicNFTData()
  }, [tokenId])

  const getBasicNFTData = () => {
    if (tokenId){
        const basicNFT = userBasicNFTs.filter(item => item.tokenID === tokenId);
        console.log("basicNFT ", JSON.stringify(basicNFT))
        setBasicNFTData(basicNFT[0])
    }
  }

  return (

    <div className={styles.container}>
  <Header userBalances={userBalances} userGnotBalances={userGnotBalances} />

  <div className="grid grid-cols-5">
    
    <div className="bg-white-100 col-span-1">
      <Menu />
    </div>   

    {basicNFTData !== null && (
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
                {basicNFTData.svgData !== undefined && (
                  <BasicNFTSmallTile key={basicNFTData.tokenID} size={`${tileSize}px`} basicNFT={basicNFTData} tokenID={basicNFTData.tokenID} />
                )}
              </div>
            </Box>
          </div>

          <div>
            <Box display="flex" flexDirection="column">
              <VStack p="2">
                <VStack width="100%" alignItems="flex-start" spacing={2} >
                <HStack>
                  <Text fontWeight="500" lineHeight="tight" isTruncated>Name:</Text> 
                  <Text fontWeight="200" lineHeight="tight" isTruncated>{basicNFTData.name}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="500" lineHeight="tight" isTruncated>Version:</Text> 
                  <Text fontWeight="200" lineHeight="tight" isTruncated>{basicNFTData.version}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="500" lineHeight="tight" isTruncated>Locked $FLIP:</Text> 
                  <Text fontWeight="200" lineHeight="tight" isTruncated>{basicNFTData.gameLevel === "64" ? "4" : "1" }</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="500" lineHeight="tight" isTruncated>Matrix size:</Text> 
                  <Text fontWeight="200" lineHeight="tight" isTruncated>{basicNFTData.gameLevel === '64' ? " 8x8" : basicNFTData.gameLevel === '16' ? " 4x4" : " unknown"}</Text>
                </HStack>  
                <HStack>
                  <Text fontWeight="500" lineHeight="tight" isTruncated>Origin:</Text> 
                  <Text fontWeight="200" lineHeight="tight" isTruncated>{basicNFTData.gameType === 'airdrop' ? " airdropped" : " organic"}</Text>
                </HStack>  
                {basicNFTData.gameType === 'airdrop' &&
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
                    <Text fontWeight="200" lineHeight="tight" isTruncated>{basicNFTData.airdropName}</Text>
                  </HStack>  
                  <HStack mb={1}>
                    <Text fontWeight="500" lineHeight="tight" isTruncated>Airdrop parent token ID:</Text> 
                    <Text fontWeight="200" lineHeight="tight" isTruncated>{basicNFTData.airdropParentID}</Text>
                  </HStack>  
                  <HStack mb={1}>
                    <Text fontWeight="500" lineHeight="tight" isTruncated>X position in parent:</Text> 
                    <Text fontWeight="200" lineHeight="tight" isTruncated>{basicNFTData.airdropXPos}</Text>
                  </HStack>  
                  <HStack mb={1}>
                    <Text fontWeight="500" lineHeight="tight" isTruncated>Y position in parent:</Text> 
                    <Text fontWeight="200" lineHeight="tight" isTruncated>{basicNFTData.airdropYPos}</Text>
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
            <Link key={basicNFTData.tokenID} href={`/inventory`} passHref>
              <Button
                bg="purple.900"
                color="white"
                _hover={{ bg: "blue.600" }}
                borderRadius="full"
              >
                Inventory
              </Button>
            </Link>
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

export default BasicNFT;