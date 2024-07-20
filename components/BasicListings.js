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
import { setBasicMarketplaceListings } from '../slices/flippandoSlice';
import { getGNOTBalances, fetchUserFLIPBalances } from '../util/tokenActions';

const BasicListings = () => {

  const basicListings = useSelector(state => state.flippando.basicMarketplaceListings);
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
    getBasicListings();
  }, []);


  const reloadMarketData = async () => {
    getBasicListings();
    fetchUserFLIPBalances(dispatch)
  }

  const getBasicListings = async () => {
    const actions = await Actions.getInstance();
    setIsLoading(true)

    try {
      console.log("getBasicListings")
      actions.getBasicListings().then((response) => {
        console.log("getBasicListings response in BasicListings.js", response);
        let parsedResponse = JSON.parse(response);
        console.log("getBasicListings parseResponse", parsedResponse)
        if(parsedResponse.error === undefined){
          dispatch(setBasicMarketplaceListings(parsedResponse.marketplaceListings))
          setIsLoading(false)
          return parsedResponse.marketplaceListings
        }
      });
    } catch (error) {
      console.error('Error retrieving Basic listings:', error);
      return null;
    }
  }

  const getPlayerAddress = async() => {
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    setPlayerAddress(playerAddress);
  }


  return (


    <div>
        {isLoading &&
            <div className="flex col-span-4 justify-center items-center">
            <Spinner loadingText={'Fetching art..'}/>
          </div>
          }
        <div className="col-span-4 flex justify-start">  
        {(basicListings.length !== 0 && !isLoading) &&
          <MarketPlaceGrid 
            marketType={"basic"}
            listings={basicListings} 
            playerAddress={playerAddress} 
            triggerReload={() => reloadMarketData()}/>
        }
      </div>
    </div>

  );
}

export default BasicListings;
