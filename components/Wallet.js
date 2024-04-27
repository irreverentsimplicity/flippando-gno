import React from "react";
import { FaWallet} from 'react-icons/fa';
import { Icon } from "@chakra-ui/react";
//import AdenaWallet from "./AdenaWallet";


const Wallet = ({ userBalances, userGnotBalances }) => {
    return (
      <div>
      {/*<AdenaWallet/>*/}
      <div className="grid grid-cols-5 pb-20 justify-end">
        <div className="col-span-5 flex justify-end pr-10">
        <div className="rounded-md flex flex-row justify-center items-center mt-3 mr-3 p-2 bg-black-400border border-gray-300" style={{ borderWidth: '0.5px' }}>
        <Icon as={FaWallet} w={6} h={6} alignSelf="left" color={'purple.600'} pr={1}/>
          <button className="text-sm font-medium gap-6 text-white border-transparent focus:outline-none">
            {userBalances.availableBalance} liquid / {userBalances.lockedBalance} locked
            $FLIP
          </button>
        </div>
        <div className="rounded-md flex flex-row justify-center items-center mt-3 p-2 bg-black-400border border-gray-300" style={{ borderWidth: '0.5px' }}>
        <Icon as={FaWallet} w={6} h={6} alignSelf="left" color={'purple.200'} pr={1}/>
          <button className="text-sm font-medium gap-6 text-white border-transparent focus:outline-none">
            {userGnotBalances} GNOT
          </button>
        </div>
        </div>
      </div>
      </div>
      )
}

export default Wallet