/* eslint-disable react/no-unknown-property */
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ethers, utils } from 'ethers';
import { setAddresses } from '../slices/flippandoSlice';
import CircleDashboard from '../components/CircleDashboard';


export default function Home() {

  const dispatch = useDispatch();
  const [flipBalance, setFlipBalance] = useState(0);
  const [lockedFlipBalance, setLockedFlipBalance] = useState(0);
  const [nfts, setNfts] = useState([]);
  const [currentBlockchain, setCurrentBlockchain] = useState(undefined);
  const blockchains = [
    {name: 'Ethereum Goerli', slug: 'goerli', chainId: 5},
    {name: 'Polygon Mumbai', slug: 'mumbai', chainId: 80001}, 
    {name: 'Polygon zkEVM', slug: 'polygon-zkevm', chainId: 1442},
    {name: 'Near Protocol', slug: 'near', chainId: 1313161555}, 
    {name: 'Flippando Saga', slug: 'flippando', chainId: 1684031009840269}, 
    {name: 'Evmos', slug: 'evmos', chainId: 9000},
    {name: 'Gnosis Chain', slug: 'gnosis', chainId: 10200},
    {name: 'Arbitrum', slug: 'arbitrum', chainId: 421611},
    {name: 'Optimism', slug: 'optimism', chainId: 420}
  ];
  
  useEffect( () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // Listen for network changes
    ethereum.on('networkChanged', handleNetworkChange);

  }, [])

  const handleNetworkChange = (network) => {
    // the specific config is set separately in Redux
    console.log(`Network changed to ${network}`);
  };
  
  const switchToNetwork = async (networkId) => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkId }],
      });
    } catch (error) {
      console.log('Failed to switch network:', error);
    }
  };

  const handleClick = (slug, chainId) => {
    console.log('slug ' + slug + ' chainId ' + slug);
    dispatch(setAddresses({network: slug}));    
    switchToNetwork(ethers.utils.hexValue(chainId));
  };

  
  return (
    <div className={styles.container}>
      
      <Head>
        <title>Flippando</title>
        <meta name="description" content="Entry point" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CircleDashboard />
    </div>
  )
}
