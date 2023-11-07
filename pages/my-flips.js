import NFTListUser from '../components/NFTlistUser'
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { useEffect, useState } from "react";

export default function MyAssets() {

  const [flipBalance, setFlipBalance] = useState(0);
  const [lockedFlipBalance, setLockedFlipBalance] = useState(0);

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
            <NFTListUser/>
        </div>
    </div>
        <div className="col-span-5 pt-20">
            <Footer/>
        
        </div>
    </div>
  )
}