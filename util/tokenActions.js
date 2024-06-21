import Actions from "./actions";
import {setUserBalances, setUserGnotBalances} from '../slices/flippandoSlice';

/*
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
  }*/
  export const getGNOTBalances = async (dispatch, callback) => {
    console.log(typeof dispatch); 
    const actions = await Actions.getInstance();
    const playerAddress = await actions.getWalletAddress();
    try {
        const response = await actions.getBalance();
        console.log("getGNOTBalances response in Flip", response);
        let parsedResponse = JSON.parse(response);
        console.log("parseResponse", JSON.stringify(parsedResponse, null, 2));
        dispatch(setUserGnotBalances(parsedResponse / 1000000));
        
        if (parsedResponse <= 80000000) {
            const fundResult = await actions.fundAccount("flippando");
            if (fundResult) {
                console.log("Account funded successfully.");
                if (callback) callback({ success: true, message: "Account funded successfully." });
            } else {
                console.log("Failed to fund account.");
                if (callback) callback({ success: false, message: "Failed to fund account." });
            }
        }
    } catch (err) {
        console.log("error in calling getGNOTBalances", err);
        if (callback) callback({ success: false, message: err.message });
    }
};


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
            // get rid of FLIP and convert to FLIP from uflip
            parsedResponse.lockedBalance = (parseInt(parsedResponse.lockedBalance.slice(0, -4)) / 1000).toString();
            parsedResponse.availableBalance = (parseInt(parsedResponse.availableBalance) / 1000).toString();
            dispatch(setUserBalances(parsedResponse))
          }
        }
      });
    } catch (err) {
      console.log("error in calling fetchUserFLIPBalances", err);
    }
  };