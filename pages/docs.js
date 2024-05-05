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
            Flippando - How it works?
          </Text>
        </Box>
        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            Game mechanics
          </Text>
          <Text fontSize="lg" textAlign="left" mt={10} mb={4} mr={4}>
            A game starts with a 4x4 empty matrix. The goal is to uncover what&apos;s underneath the tiles of the matrix, 
            by clicking on two squares of your choice. On each clicking sequence, a request is sent to the backend,
            and the tiles underneath are revealead. If they match, they remain visible. If they don&apos;t, they are
            just briefly shown and your task is to remember them.
            </Text>
            <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            The last four squares have a different behavior, shown by the game status: &quot;Flippando is heating, entering
            unstable quantum state.&quot;. To enforce solvability, the last 2 pairs (4 squares) are always matching, but their 
            colours are randomly chosen. So, even if you uncovered some of them before, the last 2 clicking sequences
            will always have random results.
          </Text>

          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            Once a matrix is uncovered, you can mint it as an on-chain NFT. We will refer to this type of NFTs as &quot;basic NFTs&quot;
            from now on. When you mint a basic NFT, a fungible GRC20 token, $FLIP, is also minted and &quot;locked&quot; inside it. 
            The $FLIP token can only be unlocked if someone else uses you basic NFT, to create a composite NFT.
          </Text>
        </Box>

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            Basic NFTs vs Composite NFTs (aka Art)
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            In the &quot;Playground&quot; section, you can see all the basic NFTs minted by all the other players. You can
            choose any of them by dragging and dropping unto the canvas. When you fill the canvas, you can then mint 
            the result as a composite NFT (which may be thought of as a form of art, as you &quot;paint&quot; with other people basic NFTS).
            <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
              </Text> 
            Each composite NFT event unlocks the $FLIP token and send it to the original creator AND transfer the basic NFT
            to the owner of the newly created composite NFT. So now you own both the art you created as a composite NFT and
            all the containing basic NFTs.
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            Once added to a composite NFTs, basic NFTs cannot be transferred individually and there is no way to &quot;de-structure&quot;
            the composite NFT into its basic pieces.
          </Text>
        </Box>

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            Dynamic Canvas Size
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            The canvas used to make art (composite NFTs) is dynamic. Its size, and, implicitly, the resolution of the
            composite NFTs, is based on the total number of unused basic NFTs. The smallest canvas size is 2x2 squares,
            and the biggest is 8x8 squares.
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
              }}
            >
              
            In the beta version, we increment with 1 square, following this pattern:
            
            <ul>
              <li>under 50 existing basic NFTs: canvas size is 2x2</li>
              <li>between 50 and 100 existing basic NFTs: canvas size is 3x3</li>
              <li>between 100 and 400 existing basic NFTs: canvas size is 4x4</li>
              <li>between 400 and 600 existing basic NFTs: canvas size is 5x5</li>
              <li>between 600 and 800 existing basic NFTs: canvas size is 6x6</li>
              <li>between 800 and 1000 existing basic NFTs: canvas size is 7x7</li>
              <li>over 1000 existing basic NFTs: canvas size is 8x8</li>
            </ul>
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            The levels used to increase the canvas size are arbitrary, and subject to change based on the feedback we 
             will receive from the actual players. We are also considering different layouts for the canvas (not only squares, but also rectangles,
             or even irregular shapes). Future versions may also feature user defined canvas sizes.
          </Text>
        </Box>

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            Tokenomics
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            The $FLIP fungible token has an uncapped supply - and there will be no airdrop or premine. As long as someone solves 
            a board and generates a basic NFT, that basic NFT will always have 1 locked $FLIP token inside. The $FLIP token 
            can be unlocked  and made really fungible, only if someone else includes that basic NFT into a composite one. 
            So the actual liquid supply is not enforced by anything other than the players behavior.
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            A composite NFT can be traded for $FLIP. Each composite NFT sale also triggers a fungible token supply reduction, 
            using randomness in a specified range. When a trade is made and the buyer pays the requested amount, 
            a part of that amount is burned. The burnable range subject to randomness is between 1% and 50% of the asking price.
            </Text>
            <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
              Example: seller lists a composite NFT for 10 $FLIP. A buyer agrees to pay 10 $FLIP to get that NFT. 
              When the sale is initiated, 
              the contract generates a random number between 1 and 50, let&apos;s say 25. In our case, 25% off of $10 FLIP 
              means 2.5 $FLIP. This amount gets burned, and the seller gets $7.5 FLIP.

              Because the randomness range is between 1% and 50%, a seller can expect to receive between 99% and 50% of
              the asking price.
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
              To recap: the potential supply is never capped, and it&apos;s a direct result of 1) solving boards and 2) creating art 
              using the solved boards as basic NFTs.
              The selling event of a composite NFT decreases the supply with a random amount, between 1 and 50%
              of the sale price. 
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            Board solvers are incentivized by the potential revenue for their painting blocks. Art collectors are incentivized
            by the actual designs (which are limitless) and by the fact that moving around goods decreases the $FLIP supply, hence 
            accruing value to the fungible token. This dynamic may create in time a positive feedback loop, that will
            increase both engagement for NFT creation, and the value of the fungible token.
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
