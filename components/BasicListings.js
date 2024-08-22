import {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import Actions from '../util/actions';
import Spinner from '../components/Spinner';
import MarketPlaceGrid from "../components/MarketPlaceGrid";
import { setBasicMarketplaceListings } from '../slices/flippandoSlice';
import { getGNOTBalances, fetchUserFLIPBalances } from '../util/tokenActions';

const BasicListings = () => {

  const basicListings = useSelector(state => state.flippando.basicMarketplaceListings);
  const [isLoading, setIsLoading] = useState(false)
  const [playerAddress, setPlayerAddress] = useState()
  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);
  const userLoggedIn = useSelector(state => state.flippando.userLoggedIn)

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
    if(userLoggedIn === "1"){
      getPlayerAddress();
      getBasicListings();
    }
  }, [userLoggedIn]);


  const reloadMarketData = async () => {
    getBasicListings();
    fetchUserFLIPBalances(dispatch)
  }

  const getBasicListings = async () => {
    const actions = await Actions.getInstance();
    if(actions.hasWallet()){
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
  }

  const getPlayerAddress = async() => {
    const actions = await Actions.getInstance();
    if(actions.hasWallet()){
      const playerAddress = await actions.getWalletAddress();
      setPlayerAddress(playerAddress);
    }
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
