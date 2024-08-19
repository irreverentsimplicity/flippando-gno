import { Textarea, Button, FormControl, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import {setUserLoggedStatus} from '../slices/flippandoSlice';
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";
import { useDispatch } from "react-redux";

const MnemonicInputForm = () => {
  const [mnemonic, setMnemonic] = useState("");
  const dispatch = useDispatch()

  const handleSaveMnemonic = async () => {
    // Save and encrypt mnemonic to IndexedDB
    console.log("Saving mnemonic: ", mnemonic);
    await getBalances()
    dispatch(setUserLoggedStatus("1"))
  };

  const getBalances = async () => {
    getGNOTBalances(dispatch, (result) => {
        if (result.success) {
            alert(result.message);
        } else {
            alert(`Error: ${result.message}`);
        }
    });

    fetchUserFLIPBalances(dispatch);
  }

  return (
    <FormControl>
      <FormLabel>Input your mnemonic</FormLabel>
      <Textarea
        placeholder="Enter your mnemonic"
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
      />
      <Button mt={4} onClick={handleSaveMnemonic}>
        Save Mnemonic
      </Button>
    </FormControl>
  );
}

export default MnemonicInputForm;
