import styles from "../styles/Home.module.css";
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Box, Text, VStack,  } from "@chakra-ui/react";
import Link from 'next/link';
import { useSelector } from 'react-redux';;
import SimpleCanvas from './SimpleCanvas';
import Actions from "../util/actions";
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";

 const SimplePlayground = () => {
  const [width, setWidth] = useState(2); // defaults, changed on calling setExistingBasicNFTs
  const [height, setHeight] = useState(2); // defaults, changed on calling setExistingBasicNFTs
  const [existingBasicNFTs, setExistingBasicNFTs] = useState(0);
  const [isArtMinted, setIsArtMinted] = useState(false)
  const artPayload = useSelector(state => state.flippando.artPayload);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpcEndpoint])

  // fetch all existing basic NFTs, used for setting the playground size
  useEffect(() => {
    console.log("fetch all existing basic NFTs")
    const fetchNFTs = async () => {
      const actions = await Actions.getInstance();
      if(actions.hasWallet()){
        try {
          actions.getAllNFTs("").then((response) => {
            console.log("fetch all existing basic NFTs response in playground.js", response);
            let parsedResponse = JSON.parse(response);
            console.log("parseResponse", parsedResponse)
            if(parsedResponse.userNFTs !== undefined && parsedResponse.userNFTs.length !== 0){
                let existingNFTs = 0
                existingNFTs = parsedResponse.userNFTs.length;
              
              if(existingNFTs !== 0){
                setExistingBasicNFTs(existingNFTs);
                console.log(existingNFTs)
                if(existingNFTs <= 50){
                  setHeight(2);
                  setWidth(2);
                }
                else if(existingNFTs > 50 && existingNFTs <= 100){
                  setHeight(3);
                  setWidth(3);
                }
                else if(existingNFTs > 100 && existingNFTs <= 400){
                  setHeight(4);
                  setWidth(4);
                }
                else if(existingNFTs > 400 && existingNFTs <= 600){
                  setHeight(5);
                  setWidth(5);
                }
                else if(existingNFTs > 600 && existingNFTs <= 800){
                  setHeight(6);
                  setWidth(6);
                }
                else if(existingNFTs > 800 && existingNFTs <= 1000){
                  setHeight(7);
                  setWidth(7);
                }
                else if(existingNFTs > 1000){
                  setHeight(8);
                  setWidth(8);
                }
              }
              
            }
          });
        } catch (err) {
          console.log("error in calling fetch all existing basic NFTs", err);
        }
      }
    };

    fetchNFTs();;
  }, []);

  async function makeArt(){
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    const height = artPayload[0]
    const width = artPayload[1]
    
    
    const bTokenIDs = JSON.stringify(artPayload[2], (key, value) => 
      (key === '' ? value : parseInt(value))
    );
    console.log("makeArt, ", JSON.stringify(artPayload))
    if (artPayload.length === 0){
      alert("You have to fill the entire canvas")
    }
    if (artPayload.length !== 0){
      
      try {
        actions.createCompositeNFT(playerAddress, String(width), String(height), bTokenIDs).then((response) => {
          console.log("createCompositeNFT response in Playground", response);
          let parsedResponse = JSON.parse(response);
          console.log("createCompositeNFT parseResponse", parsedResponse)
          if(parsedResponse.error === undefined){
            setIsArtMinted(true)
          }
        });
      } catch (err) {
        console.log("error in calling createCompositeNFT", err);
      }
    } 
  }

  return (
    
    
    <div className="col-span-4">
      <div>
        <SimpleCanvas height={height} width={width}/>
      </div>
      <div className='flex justify-center items-center text-xs pt-3 pb-5'>
          Drag and drop tiles from above into the canvas on the right. Click on a tile in the canvas to remove it. You can mint your painting once your canvas is filled.
      </div>

      
    </div>
    
    
  );
}

export default SimplePlayground;
