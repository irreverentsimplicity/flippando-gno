/* pages/my-art.js */

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/Home.module.css";
import Spinner from '../components/Spinner';
import Menu from '../components/Menu';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Actions from '../util/actions';
import { Box, Text, filter } from "@chakra-ui/react";
import ArtGridLayout from '../components/ArtGridLayout';
import { getGNOTBalances, fetchUserFLIPBalances } from '../util/tokenActions';


const FlippandoNFTs = () => {
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [enhancedNFTs, setEnhancedNFTs] = useState([]);

  const userBalances = useSelector(state => state.flippando.userBalances);
  const userGnotBalances = useSelector(state => state.flippando.userGnotBalances);
  const [isLoading, setIsLoading] = useState(false)

  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);

  const dispatch = useDispatch()
  
  useEffect( () => {
      console.log("rpcEndpoint in useEffect, my-art.js ", rpcEndpoint)
      getGNOTBalances(dispatch, (result) => {
        if (result.success) {
            alert(result.message);
        } else {
            alert(`Error: ${result.message}`);
        }
    });
      fetchUserFLIPBalances(dispatch);
  }, [rpcEndpoint]);

  useEffect(() => {
    getArtwork();
  }, []);

  useEffect( () => {
    if(ownedNFTs.length > 0 && enhancedNFTs.length === 0){
      fetchArtworkNFTsForAll(ownedNFTs);
    }
  }, [ownedNFTs, enhancedNFTs])

  const reloadArtworkData = async () => {
    console.log("reload artwork data")
    await getArtwork()
  }

  const getArtwork = async () => {
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    setIsLoading(true)

    try {
      console.log("getArtwork")
      actions.getUserCompositeNFTs(playerAddress,).then((response) => {
        console.log("getUserCompositeNFTs response in my-art.js", response);
        let parsedResponse = JSON.parse(response);
        console.log("getUserCompositeNFTs parseResponse", parsedResponse)
        if(parsedResponse.error === undefined && parsedResponse.userNFTs.length !== 0){
          let allCompositeNFTs = parsedResponse.userNFTs;
          let userListings = [];
          // get listings and filter
          try {
            console.log("getListings")
            actions.getMarketPlaceListings().then((response) => {
             // console.log("getListings response in art.js", response);
              let parsedResponse = JSON.parse(response);
              console.log("getListings parseResponse in art.js", parsedResponse)
              if(parsedResponse.error === undefined){
                userListings = parsedResponse.marketplaceListings;
                
                if (userListings.length != 0){
                  const filteredCompositeNFTs = allCompositeNFTs.filter(nft =>   
                    !userListings.some(listing => listing.tokenID === nft.tokenID)
                  );
                  console.log("filteredCompositeNFTS: ", JSON.stringify(filteredCompositeNFTs))
                  setOwnedNFTs(filteredCompositeNFTs);
                  setEnhancedNFTs([])
                  setIsLoading(false)
                  //return filteredCompositeNFTs;
                }
                else {
                  setOwnedNFTs(allCompositeNFTs);
                  console.log("allCompositeNFTs: ", JSON.stringify(allCompositeNFTs))
                  setIsLoading(false)
                  //return allCompositeNFTs;
                }
              }
            });
          } catch (error) {
            console.error('Error retrieving Artwork:', error);
            return null
          }
        }
      });
    } catch (error) {
      console.error('Error retrieving Artwork:', error);
      return null;
    }
  }

  const fetchArtworkNFTsForAll = async (compositeNFTs) => {
    const actions = await Actions.getInstance();
    const compositeNFTsWithArtwork = [];
  
    for (const compositeNFT of compositeNFTs) {
      const bTokenIds = JSON.stringify(compositeNFT.bTokenIDs);
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
    setOwnedNFTs([])
  };

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
            My Art
          </Text>
        </Box>
          {isLoading &&
            <div className="flex col-span-4 justify-center items-center">
            <Spinner loadingText={'Fetching art..'}/>
          </div>
          }
        <div className="col-span-4 flex justify-start">  
        {(ownedNFTs.length !== 0 && !isLoading) &&
          <ArtGridLayout cards={ownedNFTs} onTrigger={() => {
            null
          } 
          }/>
        }
        {(enhancedNFTs.length !== 0) &&
          <ArtGridLayout cards={enhancedNFTs} onTrigger={() => {
            reloadArtworkData() 
          }} />
        }
        {!isLoading && ownedNFTs.length === 0 && enhancedNFTs.length === 0 &&
          <Box display="flex" justifyContent="center" width="100%" mt={8}>
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            Nothing here yet
          </Text>
          </Box>
        }
        </div>
        
        </div>
      
      
    </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        </div>
    </div>

   
  );
};

export default FlippandoNFTs;
