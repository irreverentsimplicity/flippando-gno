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
  const provider = new GnoJSONRPCProvider('http://test3.gno.land:36657');
  //const provider = new GnoJSONRPCProvider('https://staging.gno.land:36657');
  //const provider = new GnoJSONRPCProvider('http://localhost:26657');
  // provider is created
  const getAnOutput = async () => {
    console.log("provider " + JSON.stringify(provider, null, 2));
    const response = await provider.getRenderOutput('gno.land/r/demo/foo20', '');
    //const response = await provider.getFunctionSignatures('gno.land/r/demo/foo721');
    //const response = await provider.evaluateExpression('gno.land/r/demo/foo20', 'TotalSupply()')
    //const response1 = await provider.evaluateExpression('gno.land/r/demo/foo721', 'init()')
    //const response = await provider.evaluateExpression('gno.land/r/demo/foo721', 'BalanceOf("g1var589z07ppjsjd24ukm4uguzwdt0tw7g47cgm")')
    
    console.log("response " + response);
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
