/* pages/my-nfts.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import NFTListUser from '../components/NFTlistUser'

import Flippando from '../artifacts/contracts/Flippando.sol/Flippando.json'

export default function MyAssets() {
  const adr = useSelector(state => state.flippando.adr);
  const flippandoAddress = adr.flippandoAddress;
  

  return (
    <div className="flex justify-center">
        <NFTListUser/>
      <div className="p-4">
      <div>
        </div>
      </div>
    </div>
  )
}