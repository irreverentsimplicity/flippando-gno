import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import NFTListUser from '../components/NFTListUser'
import Actions from "../util/actions";
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";


const MyFlips = () => {

  const userBasicNFTs = useSelector(state => state.flippando.userBasicNFTs);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true)
  const [usedNfts, setUsedNfts] = useState([])
  const [isLoadingUsedNFTs, setIsLoadingUsedNFTs] = useState(true)

  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);

  const dispatch = useDispatch()
  
  useEffect( () => {
      console.log("rpcEndpoint in useEffect, my-flips.js ", rpcEndpoint)
      getGNOTBalances(dispatch, (result) => {
        if (result.success) {
            alert(result.message);
        } else {
            alert(`Error: ${result.message}`);
        }
    });
      fetchUserFLIPBalances(dispatch);
  }, [rpcEndpoint])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actions = await Actions.getInstance();
        const playerAddress = await actions.getWalletAddress();
        console.log("fetchUsedNFTs");
        const usedResponse = await actions.getUserNFTs(playerAddress, "no");
        console.log("fetchUsedNFTs response in My flips", usedResponse);
        let parsedUsedResponse = JSON.parse(usedResponse);
        console.log("parseResponse", JSON.stringify(usedResponse, null, 2))
        if(parsedUsedResponse.userNFTs !== undefined && parsedUsedResponse.userNFTs.length !== 0){  
           setUsedNfts(parsedUsedResponse.userNFTs);
        }
        setIsLoadingUsedNFTs(false)
      } catch (err) {
        console.log("error in fetching NFTs", err);
      }
    };
  
    fetchData();
  }, []);

  useEffect( () => {
    console.log("userBasicNFTs", JSON.stringify(userBasicNFTs))
    if(userBasicNFTs !== undefined){
      setIsLoadingNFTs(false)
    }
  }, [userBasicNFTs])
  
  return (
      <div className='col-span-5 justify-start'>
      
        <div className="col-span-4">
            <NFTListUser 
            userNFTs={userBasicNFTs} 
            isLoadingUserNFTs={isLoadingNFTs} 
            isLoadingUserArtworkNFTs={isLoadingUsedNFTs} 
            userArtworkNFTs={usedNfts}/>
        </div>
      </div>
    
  )
}

export default MyFlips;