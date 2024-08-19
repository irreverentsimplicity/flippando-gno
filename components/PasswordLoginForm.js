import { Input, Button, FormControl, FormLabel } from "@chakra-ui/react";
import { getEncryptedMnemonicFromIndexedDB } from '../util/dblayer'; 
import { GnoWallet } from '@gnolang/gno-js-client';
import argon2 from 'argon2-browser';
import Actions from '../util/actions'; 
import { useState } from "react";

const PasswordLoginForm= () => {
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Decrypt mnemonic using password and verify it
    console.log("Attempting login with password: ", password);
    try {
        // Retrieve encrypted mnemonic from IndexedDB
        const encryptedMnemonic = await getEncryptedMnemonicFromIndexedDB();
        if (!encryptedMnemonic) {
          setError("No mnemonic found.");
          return;
        }
  
        // Decrypt the mnemonic
        const decryptedMnemonic = decryptMnemonic(encryptedMnemonic, password);
        if (!decryptedMnemonic) {
          setError("Incorrect password.");
          return;
        }
  
        // Create the wallet
        createWallet(decryptedMnemonic);
      } catch (error) {
        setError("Login failed: " + error.message);
      }
  };

  const decryptMnemonic = (encryptedMnemonic, password) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedMnemonic, password);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      return null; // Incorrect password or decryption error
    }
  };

  
  const createWallet = async (mnemonic) => {
    const wallet = await GnoWallet.fromMnemonic(mnemonic);
    const actions = await Actions.getInstance();
    actions.setWallet(wallet);
  };

  return (
    <FormControl>
      <FormLabel>Enter Password</FormLabel>
      <Input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button mt={4} onClick={handleLogin}>
        Log In
      </Button>
    </FormControl>
  );
}

export default PasswordLoginForm;
