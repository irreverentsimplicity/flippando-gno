import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import NFTListUser from '../components/NFTListUser'
import styles from "../styles/Home.module.css";
import { Box, Text } from "@chakra-ui/react";
import Header from "../components/Header";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import Actions from "../util/actions";
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";


export default function MyAssets() {

  const userBalances = useSelector(state => state.flippando.userBalances);
  const userGnotBalances = useSelector(state => state.flippando.userGnotBalances);
  const userBasicNFTs = useSelector(state => state.flippando.userBasicNFTs);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true)
  const [usedNfts, setUsedNfts] = useState([])
  const [isLoadingUsedNFTs, setIsLoadingUsedNFTs] = useState(true)

  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);

  const dispatch = useDispatch()
  
  useEffect( () => {
      console.log("rpcEndpoint in useEffect, my-flips.js ", rpcEndpoint)
      getGNOTBalances(dispatch);
      fetchUserFLIPBalances(dispatch);
  }, [rpcEndpoint])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actions = await Actions.getInstance();
        const playerAddress = await actions.getWalletAddress();
        console.log("fetchUsedNFTs");
        const usedResponse = await actions.getUserNFTs(playerAddress, "no");
        console.log("fetchUsedNFTs response in My flips", usedResponse);
        let parsedUsedResponse = JSON.parse(usedResponse);
        console.log("parseResponse", JSON.stringify(usedResponse, null, 2))
        if(parsedUsedResponse.userNFTs !== undefined && parsedUsedResponse.userNFTs.length !== 0){  
           setUsedNfts(parsedUsedResponse.userNFTs);
        }
        setIsLoadingUsedNFTs(false)
      } catch (err) {
        console.log("error in fetching NFTs", err);
      }
    };
  
    fetchData();
  }, []);

  useEffect( () => {
    console.log("userBasicNFTs", JSON.stringify(userBasicNFTs))
    if(userBasicNFTs !== undefined){
      setIsLoadingNFTs(false)
    }
  }, [userBasicNFTs])
  
  return (
    <div className={styles.container}>
      <Header userBalances={userBalances} userGnotBalances={userGnotBalances}/>
      
      <div className="grid flex grid-cols-5">
      
        <div className="bg-white-100 col-span-1">
        <Menu />
        </div>
        <div className='col-span-4 justify-start'>
        <Box className="justify-end" borderBottom="1px solid white" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" textAlign="right" mb={4} mr={4}>
            My Flips
          </Text>
        </Box>
        <div className="col-span-4">
            <NFTListUser 
            userNFTs={userBasicNFTs} 
            isLoadingUserNFTs={isLoadingNFTs} 
            isLoadingUserArtworkNFTs={isLoadingUsedNFTs} 
            userArtworkNFTs={usedNfts}/>
        </div>
        </div>
    </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        
        </div>
    </div>
  )
}