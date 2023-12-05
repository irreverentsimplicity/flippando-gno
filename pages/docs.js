/* pages/my-nfts.js */
//import {ethers} from 'ethers';
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { Box, Text } from "@chakra-ui/react";
import { useSelector } from 'react-redux';
import Wallet from "../components/Wallet";

export default function Tutorial() {
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
            Flippando - How it works?
          </Text>
        </Box>
        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            Game mechanics
          </Text>
          <Text fontSize="lg" textAlign="left" mt={10} mb={4} mr={4}>
            A game starts with a 4x4 empty matrix. The goal is to uncover what's underneath the tiles of the matrix, 
            by clicking on two squares of your choice. On each clicking sequence, a request is sent to the backend,
            and the tiles underneath are revealead. If they match, they remain visible. If they don't, they are
            just briefly shown and your task is to remember them.
            </Text>
            <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            The last four squares have a different behavior, shown by the game status: "Flippando is heating, entering
            unstable quantum state.". To enforce solvability, the last 2 pairs (4 squares) are always matching, but their 
            colours are randomly chosen. So, even if you uncovered some of them before, the last 2 clicking sequences
            will always have random results.
          </Text>

          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            Once a matrix is uncovered, you can mint it as an on-chain NFT. We will refer to this type of NFTs as "basic NFTs"
            from now on. When you mint a basic NFT, a fungible GRC20 token, $FLIP, is also minted and "locked" inside it. 
            The $FLIP token can only be unlocked if someone else uses you basic NFT, to create a composite NFT.
          </Text>
        </Box>

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            Basic NFTs vs Composite NFTs (aka Art)
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            In the "Playground" section, you can see all the basic NFTs minted by all the other players. You can
            choose any of them by dragging and dropping unto the canvas. When you fill the canvas, you can then mint 
            the result as a composite NFT (which may be thought of as a form of art, as you "paint" with other people basic NFTS).
            <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
              </Text> 
            Each composite NFT event unlocks the $FLIP token and send it to the original creator AND transfer the basic NFT
            to the owner of the newly created composite NFT. So now you own both the art you created as a composite NFT and
            all the containing basic NFTs.
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            Once added to a composite NFTs, basic NFTs cannot be transferred individually and there is no way to "de-structure"
            the composite NFT into its basic pieces.
          </Text>
        </Box>

        <Box className="justify-start" borderBottom="1px solid gray" mt={8}>
          <Text fontSize="xl" fontWeight="bold" textAlign="left" mb={4} mr={4}>
            Tokenomics
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            The $FLIP fungible token has an uncapped supply. In other words, as long as someone solves a board and generates a 
            basic NFT, that basic NFT will always have 1 locked $FLIP token inside. The $FLIP token can be unlocked 
            and made really fungible, only if someone else includes that basic NFT into a composite one. So the actual liquid 
            supply is not enforced by anything other than the players behavior.
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            A composite NFT can be traded for $FLIP. There is an element of randomness affecting the supply, which is 
            trieggered by a composite NFT sale event. When the trade is made and the buyer pays the requested amount, 
            a part of that amount is burned. This amount is between 1% and 50% of the asking price, randomly chosen for 
            each sale.
            </Text>
            <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
              Example: seller lists a composite NFT for 10 $FLIP. A buyer pays 10 $FLIP and gets the art. During the sale, 
              the contract generates a random number between 1 and 50, let's say 25. So 25% off of $10 FLIP, 2.5 $FLIP 
              gets burned, and the seller gets $7.5 FLIP.
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
              To recap: the potential supply is never capped, and it's a direct result of 1) solving boards and 2) creating art 
              using the solved boards as basic NFTs.
              The selling event of a composite NFT decreases the supply with a random amount, between 1 and 50%
              of the sale price. 
          </Text>
          <Text fontSize="lg" textAlign="left" mt={4} mb={4} mr={4}>
            Board solvers are incentivized by the potential revenue for their painting blocks. Art collectors are incentivized
            by the actual designs (which are limitless) and by the fact that moving around goods decreases the $FLIP supply, hence 
            accruing value to the fungible token. This dynamic
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
