import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Actions from "../util/actions";
import { setUserBasicNFTs } from "../slices/flippandoSlice";
import BasicNFTGridLayout from "../components/BasicNFTGridLayout";
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";


const MyFlips = () => {

  const userBasicNFTs = useSelector(state => state.flippando.userBasicNFTs);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true)
  const [usedNfts, setUsedNfts] = useState([])
  const [isLoadingUsedNFTs, setIsLoadingUsedNFTs] = useState(true)

  const rpcEndpoint = useSelector(state => state.flippando.rpcEndpoint);
  const userLoggedIn = useSelector(state => state.flippando.userLoggedIn)

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
        const usedResponse = await actions.getUserNFTs(playerAddress, "yes");
        console.log("reload response in My flips", usedResponse);
        let parsedUsedResponse = JSON.parse(usedResponse);
        console.log("parseResponse", JSON.stringify(usedResponse, null, 2))
        if(parsedUsedResponse.userNFTs !== undefined && parsedUsedResponse.userNFTs.length !== 0){  
           let allBasicNFTs = parsedUsedResponse.userNFTs;
            let userListings = [];
            // get listings and filter
            try {
              console.log("getBasicListings")
              actions.getBasicListings().then((response) => {
               // console.log("getListings response in art.js", response);
                let parsedResponse = JSON.parse(response);
                console.log("getBasicListings parseResponse in my flips.js", parsedResponse)
                if(parsedResponse.error === undefined){
                  userListings = parsedResponse.marketplaceListings;
                  
                  if (userListings.length != 0){
                    const filteredBasicNFTs = allBasicNFTs.filter(nft =>   
                      !userListings.some(listing => listing.tokenID === nft.tokenID)
                    );
                    console.log("filteredBasicNFTs: ", JSON.stringify(filteredBasicNFTs))
                    //setOwnedNFTs(filteredCompositeNFTs);
                    //dispatch(setUserArtNFTs(filteredCompositeNFTs));
                    dispatch(setUserBasicNFTs(filteredBasicNFTs))
                    //setEnhancedNFTs([])
                    setIsLoadingUsedNFTs(false)
                    //return filteredCompositeNFTs;
                  }
                  else {
                    //setOwnedNFTs(allCompositeNFTs);
                    dispatch(setUserBasicNFTs(allBasicNFTs))
                    console.log("allBasicNFTs: ", JSON.stringify(allBasicNFTs))
                    setIsLoadingUsedNFTs(false)
                    //return allCompositeNFTs;
                  }
                }
              });
            } catch (error) {
              console.error('Error retrieving BasicNFTs:', error);
              return null
            }
        }
        setIsLoadingUsedNFTs(false)
      } catch (err) {
        console.log("error in fetching NFTs", err);
      }
    };
    if(userLoggedIn === "1"){
      fetchData();
    }
  }, [userLoggedIn]);

  useEffect( () => {
    if(userLoggedIn === "1"){
      console.log("userBasicNFTs", JSON.stringify(userBasicNFTs))
      if(userBasicNFTs !== undefined){
        setIsLoadingNFTs(false)
      }
    }
  }, [userBasicNFTs, userLoggedIn])
  
   const reloadData = async () => {
    try {
      const actions = await Actions.getInstance();
      const playerAddress = await actions.getWalletAddress();
      console.log("fetchUsedNFTs");
      const usedResponse = await actions.getUserNFTs(playerAddress, "yes");
      console.log("reload response in My flips", usedResponse);
      let parsedUsedResponse = JSON.parse(usedResponse);
      console.log("parseResponse", JSON.stringify(usedResponse, null, 2))
      if(parsedUsedResponse.userNFTs !== undefined && parsedUsedResponse.userNFTs.length !== 0){  
         //setUsedNfts(parsedUsedResponse.userNFTs);
         //dispatch(setUserBasicNFTs(parsedUsedResponse.userNFTs))
         let allBasicNFTs = parsedUsedResponse.userNFTs;
          let userListings = [];
          // get listings and filter
          try {
            console.log("getBasicListings")
            actions.getBasicListings().then((response) => {
             // console.log("getListings response in art.js", response);
              let parsedResponse = JSON.parse(response);
              console.log("getBasicListings parseResponse in my flips.js", parsedResponse)
              if(parsedResponse.error === undefined){
                userListings = parsedResponse.marketplaceListings;
                
                if (userListings.length != 0){
                  const filteredBasicNFTs = allBasicNFTs.filter(nft =>   
                    !userListings.some(listing => listing.tokenID === nft.tokenID)
                  );
                  console.log("filteredBasicNFTs: ", JSON.stringify(filteredBasicNFTs))
                  //setOwnedNFTs(filteredCompositeNFTs);
                  //dispatch(setUserArtNFTs(filteredCompositeNFTs));
                  dispatch(setUserBasicNFTs(filteredBasicNFTs))
                  //setEnhancedNFTs([])
                  setIsLoadingUsedNFTs(false)
                  //return filteredCompositeNFTs;
                }
                else {
                  //setOwnedNFTs(allCompositeNFTs);
                  dispatch(setUserBasicNFTs(filteredBasicNFTs))
                  console.log("allBasicNFTs: ", JSON.stringify(allBasicNFTs))
                  setIsLoadingUsedNFTs(false)
                  //return allCompositeNFTs;
                }
              }
            });
          } catch (error) {
            console.error('Error retrieving BasicNFTs:', error);
            return null
          }
      }
      setIsLoadingUsedNFTs(false)
    } catch (err) {
      console.log("error in fetching NFTs", err);
    }
  };

  return (
      <div className='col-span-5 justify-start'>
      
          <BasicNFTGridLayout cards={userBasicNFTs} onTrigger={() => {
              reloadData() 
            }} />
        

      </div>
    
  )
}

export default MyFlips;