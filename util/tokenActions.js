import Actions from "./actions";
import {setUserBalances, setUserGnotBalances} from '../slices/flippandoSlice';

export const getGNOTBalances = async (dispatch) => {
    console.log(typeof dispatch); 
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
      actions.getBalance().then((response) => {
        console.log("getGNOTBalances response in Flip", response);
        let parsedResponse = JSON.parse(response);
        console.log("parseResponse", JSON.stringify(parsedResponse, null, 2))
        //setUserGnotBalances(parsedResponse/1000000)
        dispatch(setUserGnotBalances(parsedResponse/1000000))
        if(parsedResponse <= 80000000){
          actions.fundAccount("flippando")
        }
      });
    } catch (err) {
      console.log("error in calling getGNOTBalances", err);
    }
  }

  export const fetchUserFLIPBalances = async (dispatch) => {
    console.log("fetchUserFLIPBalances");
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
      actions.GetFLIPBalance(playerAddress).then((response) => {
        if (response !== undefined){
          console.log("fetchUserFLIPBalances response in Flip", response);
          let parsedResponse = JSON.parse(response);
          console.log("parseResponse", JSON.stringify(response, null, 2))
          if(parsedResponse.lockedBalance !== undefined && parsedResponse.availableBalance !== undefined){  
            //setLockedFlipBalance(parsedResponse.lockedBalance)
            //setFlipBalance(parsedResponse.availableBalance)
            dispatch(setUserBalances(parsedResponse))
          }
        }
      });
    } catch (err) {
      console.log("error in calling fetchUserFLIPBalances", err);
    }
  };