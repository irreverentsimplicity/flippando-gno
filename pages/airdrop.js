import styles from "../styles/Home.module.css";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { Box, Text } from "@chakra-ui/react";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import Link from 'next/link';

import Header from "../components/Header";
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";

export default function Airdrop() {
  const userBalances = useSelector(state => state.flippando.userBalances);
  const userGnotBalances = useSelector(state => state.flippando.userGnotBalances);
  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);
  const dispatch = useDispatch()
  useEffect( () => {
    console.log("rpcEndpoint in useEffect, docs.js ", rpcEndpoint)
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
        <Box className="justify-end" borderBottom="1px solid white" mb={4} >
          <Text fontSize="2xl" fontWeight="bold" textAlign="right" mb={4} mr={4}>
            Airdrop
          </Text>
        </Box>
        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            Disclaimer
          </Text>
          <Text fontSize="lg" textAlign="left" fontStyle="italic" mt={10} mb={4} mr={4}>
            This is an ephemereal airdrop, on a testnet. There is no value expected from, or attached to the airdropped NFTs. The main goal of this experiment
            is to stress-test the Flippando app and the chain. The state may be wiped at any time, so the NFTs may disappear from 
            your wallet.
            </Text>
            <Text fontSize="lg" textAlign="left" mt={10} mb={4} mr={4}>
            You&apos;ve been warned.
            </Text>
        </Box>

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            When?
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
           The airdrop will start on June 8th, 2024. The claim window will be open for 1 week.
          </Text>
        </Box>

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            How?
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}
          sx={{
            ul: {
              listStyleType: 'disc', 
              marginLeft: '20px', 
              marginTop: '20px',
              color: 'white', 
            },
            li: {
              '::marker': {
                color: 'white', 
              },
            },
          }}>
            The airdrop will be conducted via <Link href='https://hackerville.xyz'>https://hackerville.xyz</Link>. General conditions:
            <ul>
              
              <li> Any Gno wallet can participate</li>
              <li> There are 10,000 basic NFTs airdropped</li>
              <li> There is a max cap of 20 basic NFTs per wallet.</li>
              <li> The total number of &quot;hackers&quot; PFPs in the Hackerville collection is 156.</li>
              <li> 156 &quot;hackers&quot;, each made of 64 basic NFTS = 9984  basic NFTs. The remaining 16 basic NFTs are not part of a PFP, but will feature some very rare features.</li>
            </ul>
            </Text>
            
        </Box>

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            Why?
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            The goal is to combine the airdropped basic NFTs into composite hackerville NFTs.
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>  
            A composite hackerville NFT is made of 64 basic NFTs. Since there is a max cap of 20 basic NFTs per wallet,
            that means you should interact with other players, try and find the necessary basic NFTs needed to complete the big image.
          </Text>
          <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '450px'
        }}>
          <img src="/assets/airdrop_one.png" alt="airdrop" style={{
            width: '800px',
            height: '400px'
          }}/>
        </div>
        <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>  
            A new mode (creatively called &quot;Airdrop mode&quot;) has been added to the Playground section of Flippando.
          
          <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '450px'
        }}>
          <img src="/assets/airdrop_mode_1.png" alt="airdrop" style={{
            width: '800px',
            height: '350px'
          }}/>
        </div>
        When switched on, this mode let you browse the Hackerville PFP images.

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '450px'
        }}>
          <img src="/assets/airdrop_mode_2.png" alt="airdrop" style={{
            width: '800px',
            height: '350px'
          }}/>
        </div>
        Once you find the image you want to assemble from your airdropped basic NFTs, click on it, and it will show up
        under the canvas, to help you in the assembly process.

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '450px'
        }}>
          <img src="/assets/airdrop_mode_3.png" alt="airdrop" style={{
            width: '800px',
            height: '350px'
          }}/>
        </div>
        </Text>
        </Box>

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            Tokenomics?
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
           In a normal Flippando game, each basic NFT has 1 fungible FLIP token locked inside. Once someone else uses that
           basic NFT in a composite NFT, the fungible token is released and sent to the initial creator.
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
           In the airdrop, the fungible FLIP token, once released, will be sent to a special airdrop account. This account
           will then add the tokens to a liquidity pool in GnoSwap, helping bootstrap the fungible token ecosystem.
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
           Since the basic NFT airdropped will be made of 8x8 squares, the number of FLIP tokens inside each is 4. So each
           PFP assembled will release 4 FLIP x 64 basic NFTs = 256 FLIP tokens. The total number of fungible FLIP tokens 
           generated in this airdrop will be 156 hackers * 256 FLIP tokens = 39936.

          </Text>
        </Box>

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            When again?
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
           The airdrop will start on June 8th, 2024. The claim window will be open for 1 week. We already told you that.
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
