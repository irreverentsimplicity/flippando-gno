import styles from "../styles/Home.module.css";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { Box, Text } from "@chakra-ui/react";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import Header from "../components/Header";
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";

export default function Tutorial() {
  const userBalances = useSelector(state => state.flippando.userBalances);
  const userGnotBalances = useSelector(state => state.flippando.userGnotBalances);
  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);

  const dispatch = useDispatch()
  
  useEffect( () => {
      console.log("rpcEndpoint in useEffect, market.js ", rpcEndpoint)
      getGNOTBalances(dispatch);
      fetchUserFLIPBalances(dispatch);
  }, [rpcEndpoint])

  return (
    <div className={styles.container}>
      <Header userBalances={userBalances} userGnotBalances={userGnotBalances}/>
      
      <div className="grid flex grid-cols-5">
      
        <div className="bg-white-100 col-span-1">
        <Menu />
        </div>


    <div className="col-span-4 mr-12 ml-12">
        <Box className="justify-end" borderBottom="1px solid white" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" textAlign="right" mb={4} mr={4}>
            Roadmap
          </Text>
        </Box>
        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
        
        <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>✅ Ground Zero (beta, testnet) - target: Jan 2024</Text>
        <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
          - launch on https://gno.flippando.xyz (backend deployed to local environment / testnet environment)
        </Text>  
        <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
         - full game mechanics: 
        </Text>  
        <Text fontSize="md" textAlign="left" mt={4} mb={4} ml={8}>
         - flip 16 or 64 tiles and mint them as basic nfts
        </Text>
        <Text fontSize="md" textAlign="left" mt={4} mb={4} ml={8}>
         - tiles can be flipped with: 16 basic colors, 4 types of gradients (red, green, blue, grey), dice and hexagrams
        </Text>
        <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
         - drag and drop basic nfts made by other players in the playground, and assemble them in composite nfts (artwork)
        </Text>
        <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
         - basic marketplace listing and trading with respect to tokenomics
        </Text>
        </Box>
        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
        
        <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>✅ Land of the Flips (beta, testnet) - target: March 2024</Text>
        <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - adjust playground dynamically to account for the current number of available basic NFTs
          </Text> 
          <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - full game management (recover and replay interrupted games)
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - faucet improvements
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - Gnoswap integration for the FLIP fungible token
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - backend versioning and consistent upgrade mechanism for realm deployments
          </Text> 
        </Box>

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
        
        <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>⏳ The airdrop (beta, testnet) - target: June 2024</Text>
        <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - stress test for a 10,000 basic NFTs airdrop
          </Text> 
          <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - test liquidity bootstrapping for the fungible FLIP token
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - faucet hub listing
          </Text>
        </Box>

        

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
        <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>⏳ Awakening (production, mainnet) - target: July 2024</Text>
        <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - feature freeze
        </Text>
        <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - mainnet launch on Gno and EVM chains (Saga, Evmos, Polygon)
        </Text>
      </Box>
      <Box className="justify-start" borderBottom="1px solid gray" mt={8}>  
        <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>⏳ The Flip Connection (production, mainnet, cross-chain integration) - target: October 2024</Text>
        <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - transfer / bridge NFTs from Gno to Flippando deployments on EVM chains
          </Text>  
          <Text fontSize="lg" textAlign="left" mt={4} mb={4}>
          - transfer / bridge FLIP fungible tokens from Gno to Flippando deployments on EVM chains
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
