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
import { setArtMarketplaceListings } from '../slices/flippandoSlice';
import { getGNOTBalances, fetchUserFLIPBalances } from '../util/tokenActions';

const  ArtListings = () => {

  const [enhancedNFTs, setEnhancedNFTs] = useState([]);
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [playerAddress, setPlayerAddress] = useState()
  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);

  const dispatch = useDispatch()
  
  useEffect( () => {
      console.log("rpcEndpoint in useEffect, market.js ", rpcEndpoint)
      getGNOTBalances(dispatch, (result) => {
        if (result.success) {
            alert(result.message);
        } else {
            alert(`Error: ${result.message}`);
        }
    });
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


  const reloadMarketData = async () => {
    setEnhancedNFTs([])
    console.log("reload market data")
    getListings().then( response => {
      if (response !== undefined && response.length !== 0) {
        fetchArtworkNFTsForAll(response);
      }
    })
    fetchUserFLIPBalances(dispatch)
  }

  const getListings = async () => {
    const actions = await Actions.getInstance();
    setIsLoading(true)

    try {
      console.log("getListings")
      actions.getCompositeListings().then((response) => {
        console.log("getListings response in ArtListings.js", response);
        let parsedResponse = JSON.parse(response);
        //console.log("getUserCompositeNFTs parseResponse", parsedResponse)
        if(parsedResponse.error === undefined){
          fetchArtworkNFTsForAll(parsedResponse.marketplaceListings);
          setListings(parsedResponse.marketplaceListings)
          dispatch(setArtMarketplaceListings(parsedResponse.marketplaceListings))
          setIsLoading(false)
          return parsedResponse.marketplaceListings
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
    dispatch(setArtMarketplaceListings(compositeNFTsWithArtwork))
    setListings([])
  };

  return (
    


    <div >
    
        {isLoading &&
            <div className="flex col-span-4 justify-center items-center">
            <Spinner loadingText={'Fetching art..'}/>
          </div>
          }
        <div className="col-span-4 flex justify-start">  
        {(listings.length !== 0 && !isLoading) &&
          <MarketPlaceGrid listings={listings} playerAddress={playerAddress} triggerReload={() => reloadMarketData()}/>
        }
        {(enhancedNFTs.length !== 0) &&
          <MarketPlaceGrid 
            marketType="art"
            listings={enhancedNFTs} 
            playerAddress={playerAddress} 
            triggerReload={() => reloadMarketData()}/>
        }
      </div>
    </div>

  );
}

export default ArtListings;
