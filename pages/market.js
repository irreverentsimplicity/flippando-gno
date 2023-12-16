import {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import Actions from '../util/actions';
import { Box, Text } from "@chakra-ui/react";
import Wallet from "../components/Wallet";
import Spinner from '../components/Spinner';
import MarketPlaceGrid from "../components/MarketPlaceGrid";

export default function Market() {

  const userBalances = useSelector(state => state.flippando.userBalances);
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getListings();
  }, []);

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
  return (
    <div className={styles.container}>
      <Head>
        <title>Flippando</title>
        <meta name="description" content="Entry point" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wallet userBalances={userBalances} />
      
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
          <MarketPlaceGrid listings={listings} />
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
