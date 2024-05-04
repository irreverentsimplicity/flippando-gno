import React, {useState} from "react";
import { FaWallet} from 'react-icons/fa';
import { Icon, Select } from "@chakra-ui/react";
//import AdenaWallet from "./AdenaWallet";


const Wallet = ({ userBalances, userGnotBalances }) => {

    const [network, setNetwork] = useState('Ethereum'); // Default network

    const handleNetworkChange = (event) => {
      setNetwork(event.target.value);
      console.log("event.target.value, ", event.target.value)
      // Additional logic to update the network can be implemented here
    };

    return (
      <div>
      {/*<AdenaWallet/>*/}
      <div className="grid grid-cols-5 pb-10 justify-end">
        <div className="col-span-5 flex justify-end pr-10">
          <div className="rounded-md flex flex-row justify-center items-center mt-3 mr-3 p-2 bg-black-400border border-purple-400" style={{ borderWidth: '0.5px' }}>
          <Icon as={FaWallet} w={6} h={6} alignSelf="left" color={'purple.600'} pr={1}/>
            <button className="text-sm font-small gap-6 text-white border-transparent focus:outline-none">
              {userBalances.availableBalance} liquid / {userBalances.lockedBalance} locked
              $FLIP
            </button>
          </div>
          <div className="rounded-md flex flex-row justify-center items-center mt-3 p-2 bg-black-400border border-purple-400" style={{ borderWidth: '0.5px' }}>
          <Icon as={FaWallet} w={6} h={6} alignSelf="left" color={'purple.200'} pr={1}/>
            <button className="text-sm font-small gap-6 text-white border-transparent focus:outline-none">
              {userGnotBalances} GNOT
            </button>
          </div>
        </div>
        <div className="col-span-5 flex justify-end pr-10 pt-2">
          <Select onChange={handleNetworkChange} value={network}
          size="sm"
          fontSize="sm"
          backgroundColor="purple.700"
          color="white"
          borderColor="purple.500"
          _hover={{ bg: 'purple.600' }}
          _focus={{ boxShadow: 'outline' }}>
          <option value="flippando" selected>Flippando RPC</option>
          <option value="portal-loop">Portal Loop RPC</option>
        </Select>
        </div>
      </div>
      </div>
      )
}

export default Wallet