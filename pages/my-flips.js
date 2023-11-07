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

  useEffect(() => {
    fetchUserNFTs();
  }, []);


  const fetchUserNFTs = async () => {
    console.log("fetchUserNFTs");
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
      actions.getUserNFTs(playerAddress).then((response) => {
        console.log("getUserNFTS response in My flips", response);
        let parsedResponse = JSON.parse(response);
        console.log("parseResponse", JSON.stringify(response, null, 2))
        if(parsedResponse.userNFTs !== undefined && parsedResponse.userNFTs.length !== 0){  
           setNfts(parsedResponse.userNFTs)
        }
      });
    } catch (err) {
      console.log("error in calling getUserNFTs", err);
    }
  };

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
        <div className="col-span-3">
            <NFTListUser userNFTs={nfts} userArtworkNFTs={null}/>
        </div>
    </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        
        </div>
    </div>
  )
}