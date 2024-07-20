import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import ArtListings from "../components/ArtListings";
import BasicListings from "../components/BasicListings";
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";


import { Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Badge } from '@chakra-ui/react';

const Market = () => {
  
  const userBalances = useSelector(state => state.flippando.userBalances);
  const userGnotBalances = useSelector(state => state.flippando.userGnotBalances);
  const basicListings = useSelector(state => state.flippando.basicMarketplaceListings);
  const artListings = useSelector(state => state.flippando.artMarketplaceListings);
  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);

  const dispatch = useDispatch()
  
  
  useEffect( () => {
    console.log("rpcEndpoint in useEffect, marketjs ", rpcEndpoint)
    getGNOTBalances(dispatch, (result) => {
      if (result.success) {
          alert(result.message);
      } else {
          alert(`Error: ${result.message}`);
      }
  });
    fetchUserFLIPBalances(dispatch);
}, [rpcEndpoint]);

  return (

    <div className={styles.container}>
      <Header userBalances={userBalances} userGnotBalances={userGnotBalances}/>
      
      <div className="grid flex grid-cols-5">
      
        <div className="bg-white-100 col-span-1">
        <Menu />
        </div>   
        <div className='col-span-4 justify-start'>
      

        <Tabs variant="enclosed-colored">
          <TabList justifyContent={"flex-end"} >
            <Tab
              bg="purple.400"
              _selected={{ bg: "purple.900", color: "white" }}
              _hover={{ bg: "purple.700", color: "white" }}
              _active={{ color: "purple.700" }}
              color="purple.900"
              fontWeight="bold"
            >
              <HStack spacing={4}>
                <span>Basic NFTs</span>
                <Badge colorScheme="gray">{basicListings.length}</Badge>
              </HStack>
            </Tab>
            <Tab
              bg="purple.400"
              _selected={{ bg: "purple.900", color: "white" }}
              _hover={{ bg: "purple.700", color: "white" }}
              _active={{ color: "purple.700" }}
              color="purple.900"
              fontWeight="bold"
            >
              <HStack spacing={4}>
                <span>Art NFTs</span>
                <Badge colorScheme="gray">{artListings.length}</Badge>
              </HStack>
            </Tab>
            
          </TabList>

          <TabPanels>
            <TabPanel>
              <BasicListings/>
            </TabPanel>
            <TabPanel>
              <ArtListings/>
            </TabPanel>
          </TabPanels>
        </Tabs>
        </div>
            <div className="col-span-5 pt-20">
                <Footer/>
            </div>
        </div>
    </div>
  );
};

export default Market;
