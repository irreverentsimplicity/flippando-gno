import NFTListUser from '../components/NFTlistUser'
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { useEffect, useState } from "react";
import Actions from "./util/actions";

export default function MyAssets() {

  const [flipBalance, setFlipBalance] = useState(0);
  const [lockedFlipBalance, setLockedFlipBalance] = useState(0);
  const [nfts, setNfts] = useState([])
  const [usedNfts, setUsedNfts] = useState([])


  /*
  useEffect(() => {
    fetchReadyToUseNFTs();
  }, []);

  useEffect(() => {
    fetchUsedNFTs();
  }, []);*/

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetchReadyToUseNFTs");
        const actions = await Actions.getInstance();
        const playerAddress = await actions.getWalletAddress();
  
        const readyToUseResponse = await actions.getUserNFTs(playerAddress, "yes");
        console.log("fetchReadyToUseNFTs response in My flips", readyToUseResponse);
        let parsedReadyToUseResponse = JSON.parse(readyToUseResponse);
        console.log("parseResponse", JSON.stringify(readyToUseResponse, null, 2))
        if(parsedReadyToUseResponse.userNFTs !== undefined && parsedReadyToUseResponse.userNFTs.length !== 0){  
           setNfts(parsedReadyToUseResponse.userNFTs);
        }
  
        console.log("fetchUsedNFTs");
        const usedResponse = await actions.getUserNFTs(playerAddress, "used");
        console.log("fetchUsedNFTs response in My flips", usedResponse);
        let parsedUsedResponse = JSON.parse(usedResponse);
        console.log("parseResponse", JSON.stringify(usedResponse, null, 2))
        if(parsedUsedResponse.userNFTs !== undefined && parsedUsedResponse.userNFTs.length !== 0){  
           setUsedNfts(parsedUsedResponse.userNFTs);
        }
      } catch (err) {
        console.log("error in fetching NFTs", err);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Flippando</title>
        <meta name="description" content="Entry point" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-cols-5 pb-20 justify-end">
        <div className="col-span-5 flex justify-end pr-10">
        <div className="rounded-md flex flex-col justify-center items-center mt-3 pl-3 pr-3 bg-gray-600">
          <button className="text-sm font-medium gap-6 font-quantic text-white border-transparent focus:outline-none">
            {flipBalance} liquid / {lockedFlipBalance + flipBalance} locked
            $FLIP
          </button>
        </div>
        </div>
      </div>
      
      <div className="grid flex grid-cols-5">
      
        <div className="bg-white-100 col-span-1">
        <Menu />
        </div>
        <div className="col-span-4">
            <NFTListUser userNFTs={nfts} userArtworkNFTs={usedNfts}/>
        </div>
    </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        
        </div>
    </div>
  )
}