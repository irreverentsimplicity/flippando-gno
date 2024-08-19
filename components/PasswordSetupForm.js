import { Input, Button, FormControl, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import { GnoWallet } from '@gnolang/gno-js-client';
import Actions from '../util/actions'; 
import argon2 from 'argon2-browser';
import { saveEncryptedMnemonicToIndexedDB } from '../util/dblayer'; 
import { generateMnemonic } from "../util/crypto";


const PasswordSetupForm = ()=> {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mnemonic, setMnemonic] = useState(null);
  const [error, setError] = useState(null);

  const handlePasswordSetup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Hash the password using Argon2
    const hash = await argon2.hash({
      pass: password,
      salt: CryptoJS.lib.WordArray.random(128 / 8).toString(), // Generate a random salt
      type: argon2.ArgonType.Argon2id,
    });
    console.log("Password set:", password);

     const newMnemonic = generateMnemonic();
     setMnemonic(newMnemonic);
 
     // Encrypt and store the mnemonic with the password
     await encryptAndStoreMnemonic(newMnemonic, password);
     await createWallet(newMnemonic);
  };

  const encryptAndStoreMnemonic = async (mnemonic, password) => {
    try {
      const encryptedMnemonic = CryptoJS.AES.encrypt(mnemonic, password).toString();
      await saveEncryptedMnemonicToIndexedDB(encryptedMnemonic);
      console.log("Mnemonic encrypted and saved successfully.");
    } catch (err) {
      setError("Failed to save encrypted mnemonic.");
    }
  };

  const createWallet = async (mnemonic) => {
    const wallet = await GnoWallet.fromMnemonic(mnemonic);
    const actions = await Actions.getInstance();
    actions.setWallet(wallet);
  };

  return (
    <FormControl>
      <FormLabel>Set Password</FormLabel>
      <Input
        key="1"
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        key="2"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        mt={4}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button mt={4} onClick={handlePasswordSetup}>
        Set Password
      </Button>
    </FormControl>
  );
}

export default PasswordSetupForm;
