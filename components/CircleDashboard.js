import React from 'react';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import { useDispatch } from 'react-redux';
import { setAddresses } from '../slices/flippandoSlice';

function CircleDashboard() {

   const dispatch = useDispatch();
    
  const blockchains = [
    {name: 'Ethereum Goerli', slug: 'goerli', chainId: 5},
    {name: 'Polygon Mumbai', slug: 'mumbai', chainId: 80001}, 
    {name: 'Polygon zkEVM', slug: 'polygon-zkevm', chainId: 1442},
    {name: 'Near Protocol', slug: 'near', chainId: 1313161555}, 
    {name: 'Flippando Saga', slug: 'flippando', chainId: 1684031009840269}, 
    {name: 'Evmos', slug: 'evmos', chainId: 9000},
    {name: 'Gnosis Chain', slug: 'gnosis', chainId: 10200},
    {name: 'Arbitrum', slug: 'arbitrum', chainId: 421613},
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
    console.log('slug ' + slug + ' chainId ' + chainId);
    dispatch(setAddresses({network: slug}));    
    switchToNetwork(ethers.utils.hexValue(chainId)).then( () => {
        const {pathname} = Router
        if(pathname == '/' ){
            Router.push('/flip')
        }
    });
  };

  return (
    <div>
    <h1 className='flex justify-center text-4xl my-10'>Choose your flipping territory</h1>
    <div className='flex justify-center p-2 m-2 rounded-lg shadow-lg bg-gray-200'>
        
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">
    <g id="flippando">
    <circle cx="400" cy="248" r="150" fill="#20262E" stroke="#20262E" strokeWidth="2" onClick={(event) => handleClick("flippando", 1684031009840269)}>
    </circle>
    <text x="50%" y="230" textAnchor="middle" alignmentBaseline="middle" dominantBaseline="central" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1px" fontFamily='Arial' fontSize={34}>Flippando Saga</text>
    </g>
    <g id="mumbai">
    <circle cx="240" cy="315" r="80" fill="#FA7070" stroke="#FA7070" strokeWidth="2" onClick={(event) => handleClick("mumbai", 80001)}  />
    <text x="235" y="315" textAnchor="middle" alignmentBaseline="middle" stroke="#000000" fill="#000000" strokeWidth="1px" fontFamily='Arial' fontSize={24}>Mumbai</text>
    </g>
    <g id="polygon-zkevm">
    <circle cx="560" cy="320" r="60" fill="#B2A4FF" stroke="#B2A4FF" strokeWidth="2" onClick={(event) => handleClick("polygon-zkevm", 1442)}  />
    <text x="558" y="318" textAnchor="middle" alignmentBaseline="middle" stroke="#000000" fill="#000000" strokeWidth="1px" fontFamily='Arial' fontSize={14}>Polygon zkEVM</text>
    </g>
    <g id="goerli">
        <circle cx="600" cy="80" r="40" fill="#F0A500" stroke="#F0A500" strokeWidth="2" onClick={(event) => handleClick("goerli", 5)}  />
        <text x="600" y="78" textAnchor="middle" alignmentBaseline="middle" stroke="#000000" fill="#000000" strokeWidth="1px" fontFamily='Arial' fontSize={20}>Goerli</text>
    </g>
    <g id="near">
        <circle cx="580" cy="170" r="55" fill="#22A5dd" stroke="#22A5dd" strokeWidth="2" onClick={(event) => handleClick("near", 1313161555)}  />
        <text x="580" y="169" textAnchor="middle" alignmentBaseline="middle" stroke="#000000" fill="#000000" strokeWidth="1px" fontFamily='Arial' fontSize={20}>Near</text>
    </g>
    <g id="evmos">
        <circle cx="400" cy="70" r="55" fill="#C0EEE4" stroke="#C0EEE4" strokeWidth="2" onClick={(event) => handleClick("evmos", 9000)}  />
        <text x="400" y="70" textAnchor="middle" alignmentBaseline="middle" stroke="#000000" fill="#000000" strokeWidth="1px" fontFamily='Arial' fontSize={24}>Evmos</text>
    </g>
    <g id="optimism">
        <circle cx="200" cy="190" r="35" fill="#FFB4B4" stroke="#FFB4B4" strokeWidth="2" onClick={(event) => handleClick("arbitrum", 421611)}  />
        <text x="200" y="190" textAnchor="middle" alignmentBaseline="middle" stroke="#000000" fill="#000000" strokeWidth="1px" fontFamily='Arial' fontSize={14}>Optimism</text>
    </g>
    <g id="arbitrum">
        <circle cx="220" cy="120" r="30" fill="#FFDEB4" stroke="#FFDEB4" strokeWidth="2" onClick={(event) => handleClick("optimism", 420)}  />
        <text x="220" y="119" textAnchor="middle" alignmentBaseline="middle" stroke="#000000" fill="#000000" strokeWidth="1px" fontFamily='Arial' fontSize={14}>Arbitrum</text>
        
    </g>
    
    
    </svg>
    </div>
    </div>
  );
}

export default CircleDashboard;





