/* eslint-disable react/no-unknown-property */
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { GnoJSONRPCProvider } from '@gnolang/gno-js-client';
import { useDispatch } from 'react-redux';

export default function Home() {
  const dispatch = useDispatch();
  useEffect( () => {
    getAnOutput()
  }, []);
  const provider = new GnoJSONRPCProvider('http://localhost:26657');
  // provider is created
  const getAnOutput = async () => {
    
    const signatures = await provider.getFunctionSignatures('gno.land/r/demo/flippando', '');
    console.log("signatures ", signatures);

    const response = await provider.evaluateExpression('gno.land/r/demo/flippando', 'StartGame("owner", "gameId", "gameTyoe", 4)');
    console.log("response ", response);
    return response;
  }  


  return (
    <div className={styles.container}>
      
      <Head>
        <title>Flippando</title>
        <meta name="description" content="Entry point" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
