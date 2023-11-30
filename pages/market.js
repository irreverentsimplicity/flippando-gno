/* pages/my-nfts.js */
//import {ethers} from 'ethers';
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Box, Text } from "@chakra-ui/react";
import { useDrag, useDrop } from 'react-dnd';
import Wallet from "../components/Wallet";
import SmallTile from '../components/SmallTile';
import Canvas from '../components/Canvas';
import Grey from './assets/squares/grey.svg';
import Image from 'next/image';
import artNFT from './assets/artNFT.jpg';
import Actions from "./util/actions";

export default function Market() {

  const userBalances = useSelector(state => state.flippando.userBalances);


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
     
    </div>

    </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        
        </div>
    </div>
  );
}
