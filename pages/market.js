import {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/Home.module.css";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import Actions from '../util/actions';
import { Box, Text } from "@chakra-ui/react";
import Header from "../components/Header";
import Spinner from '../components/Spinner';
import MarketPlaceGrid from "../components/MarketPlaceGrid";
import { getGNOTBalances, fetchUserFLIPBalances } from '../util/tokenActions';

export default function Market() {

  const userBalances = useSelector(state => state.flippando.userBalances);
  const userGnotBalances = useSelector(state => state.flippando.userGnotBalances);
  const [enhancedNFTs, setEnhancedNFTs] = useState([]);
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [playerAddress, setPlayerAddress] = useState()
  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);

  const dispatch = useDispatch()
  
  useEffect( () => {
      console.log("rpcEndpoint in useEffect, market.js ", rpcEndpoint)
      getGNOTBalances(dispatch);
      fetchUserFLIPBalances(dispatch);
  }, [rpcEndpoint])

  useEffect(() => {
    getPlayerAddress();
    getListings();
  }, []);

  useEffect( () => {
    getPlayerAddress();
    if(listings.length > 0 && enhancedNFTs.length === 0){
      fetchArtworkNFTsForAll(listings);
    }
  }, [enhancedNFTs, listings])

  const getListings = async () => {
    const actions = await Actions.getInstance();
    setIsLoading(true)

    try {
      console.log("getListings")
      actions.getMarketPlaceListings().then((response) => {
        console.log("getListings response in market.js", response);
        let parsedResponse = JSON.parse(response);
        //console.log("getUserCompositeNFTs parseResponse", parsedResponse)
        if(parsedResponse.error === undefined){
          //fetchArtworkNFTsForAll(parsedResponse.userNFTs);
          setListings(parsedResponse.marketplaceListings)
          setIsLoading(false)
        }
      });
    } catch (error) {
      console.error('Error retrieving Artwork:', error);
      return null;
    }
  }

  const getPlayerAddress = async() => {
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    setPlayerAddress(playerAddress);
  }

  const fetchArtworkNFTsForAll = async (compositeNFTs) => {
    const actions = await Actions.getInstance();
    const compositeNFTsWithArtwork = [];
  
    for (const compositeNFT of compositeNFTs) {
      //console.log('compositeNFT', compositeNFT)
      const bTokenIds = JSON.stringify(compositeNFT.tokenURI.bTokenIDs);
      //console.log('bTokenIds ', bTokenIds )
      try {
        const response = await actions.getArtworkNFTs(bTokenIds);
        const parsedResponse = JSON.parse(response);
        if (!parsedResponse.error) {
          compositeNFTsWithArtwork.push({
            ...compositeNFT,
            artworkNFT: parsedResponse.userNFTs
          });
        } else {
          compositeNFTsWithArtwork.push(compositeNFT);
        }
      } catch (error) {
        console.error('Error retrieving basic NFTs for composite NFT:', error);
        compositeNFTsWithArtwork.push(compositeNFT);
      }
    }
    setEnhancedNFTs(compositeNFTsWithArtwork);
    setListings([])
  };

  return (
    <div className={styles.container}>
      <Header userBalances={userBalances} userGnotBalances={userGnotBalances}/>
      
      <div className="grid flex grid-cols-5">
      
        <div className="bg-white-100 col-span-1">
        <Menu />
        </div>


    <div className="col-span-4">
    <Box className="justify-end" borderBottom="1px solid white" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" textAlign="right" mb={4} mr={4}>
            Market
          </Text>
        </Box>
        {isLoading &&
            <div className="flex col-span-4 justify-center items-center">
            <Spinner loadingText={'Fetching art..'}/>
          </div>
          }
        <div className="col-span-4 flex justify-start">  
        {(listings.length !== 0 && !isLoading) &&
          <MarketPlaceGrid listings={listings} playerAddress={playerAddress}/>
        }
        {(enhancedNFTs.length !== 0) &&
          <MarketPlaceGrid listings={enhancedNFTs} playerAddress={playerAddress}/>
        }
      </div>
    </div>

    </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        
        </div>
    </div>
  );
}
