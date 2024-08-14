import React, {useState} from "react";
import { FaWallet} from 'react-icons/fa';
import { Icon, Select } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { setRpcEndpoint } from "../slices/flippandoSlice";
import Actions from "../util/actions";
import Config from '../util/config';
//import AdenaWallet from "./AdenaWallet";


const Wallet = ({ userBalances, userGnotBalances }) => {

    const dispatch = useDispatch();
    const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);
    
    const handleNetworkChange = async (event) => {
      const newNetwork = event.target.value;
      console.log("newNetwork, ", newNetwork)
      dispatch(setRpcEndpoint(newNetwork))
      const actionsInstance = await Actions.getInstance();
      let faucetUrl = "";
      let flippandoRealm = "";
      if (newNetwork === "http://localhost:26657"){
        faucetUrl = "http://127.0.0.1:5050";
        flippandoRealm = "gno.land/r/demo/flippando"
      } else if (newNetwork === "https://rpc.irreverentsimplicity.xyz") {
        faucetUrl = "https://faucet.irreverentsimplicity.xyz";
        flippandoRealm = "gno.land/r/flippando/flippando"
      } else if (newNetwork === "https://portal-loop.gnoteam.com"){
        faucetUrl = "https://faucet.flippando.xyz";
        flippandoRealm = "gno.land/r/demo/flippando/v1"
      }
      actionsInstance.setFaucetUrl(faucetUrl);
      actionsInstance.setFlippandoRealm(flippandoRealm);
      actionsInstance.setRpcUrl(newNetwork);
    };

    const showLocalOption = process.env.NEXT_PUBLIC_SHOW_LOCAL_OPTION === 'true';
    //console.log('NEXT_PUBLIC_SHOW_LOCAL_OPTION:', process.env.NEXT_PUBLIC_SHOW_LOCAL_OPTION);
    //console.log("Config.GNO_JSONRPC_URL: ", Config.GNO_JSONRPC_URL);

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
          <Select onChange={handleNetworkChange} value={rpcEndpoint}
          size="sm"
          fontSize="sm"
          backgroundColor="purple.700"
          color="white"
          borderColor="purple.500"
          _hover={{ bg: 'purple.600' }}
          _focus={{ boxShadow: 'outline' }}>
          {showLocalOption && <option value="http://localhost:26657">Local node</option>}
          <option value="https://rpc.irreverentsimplicity.xyz" >IrreverentSimplicity RPC</option>
        </Select>
        </div>
      </div>
      </div>
      )
}

export default Wallet
