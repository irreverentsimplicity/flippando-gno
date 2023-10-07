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

  /*
  useEffect( () => {
    if (!window.adena) {
      window.open("https://adena.app/", "_blank");
    } else {
      adena.AddEstablish("Flippando");
    }
  })
  useEffect( () => {
    adena.GetAccount().then( (account) => {
      console.log('account', account);
    })
  })*/
  const provider = new GnoJSONRPCProvider('http://localhost:26657');
  // provider is created
  const getAnOutput = async () => {
    
    /*
    const signatures = await provider.getFunctionSignatures('gno.land/p/demo/flippando', '');
    console.log("signatures ", signatures);

    const response = await provider.evaluateExpression('gno.land/p/demo/flippando', 'StartGame()');
    console.log("response ", response);
    return response;*/

    
    const signatures = await provider.getFunctionSignatures('gno.land/r/demo/flippando', '');
    console.log("signatures ", signatures);

    const response = await provider.evaluateExpression('gno.land/r/demo/flippando', 'StartGame("a","b","dice",4)');
    console.log("response " + JSON.stringify(response));
    // Extract the string value
    const stringValueRegex = /\("(.+)" string\)/;
    const stringValueMatch = response.match(stringValueRegex);
    const stringValue = stringValueMatch ? stringValueMatch[1] : null;

    // Extract the array of integers
    const arrayValueRegex = /slice\[((?:\(\d+ int\),?)+) \[\]int\)/;
    const arrayValueMatch = response.match(arrayValueRegex);
    const arrayValues = arrayValueMatch ? arrayValueMatch[1].match(/\d+/g).map(Number) : null;

    console.log("String Value:", stringValue);  // Outputs: b
    console.log("Array Values:", arrayValues);  // Outputs: [0, 0, 0, 0]
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
