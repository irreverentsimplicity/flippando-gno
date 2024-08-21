import { Input, Button, FormControl, FormLabel, Switch, Textarea, Text } from "@chakra-ui/react";
import { useState } from "react";
import { GnoWallet } from '@gnolang/gno-js-client';
import Actions from '../util/actions'; 
import { saveEncryptedMnemonicToIndexedDB } from '../util/dblayer'; 
import { deriveKey, encryptMnemonic, validateMnemonic } from '../util/crypto';
import { generateMnemonic } from "../util/crypto";
import { useDispatch } from "react-redux";
import { setUserLoggedStatus } from "../slices/flippandoSlice";
import { getGNOTBalances, fetchUserFLIPBalances } from "../util/tokenActions";

const PasswordSetupForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState(null);
  const [isImportWallet, setIsImportWallet] = useState(false);
  const dispatch = useDispatch();

  const handlePasswordSetup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Handle the case of importing a wallet
    let walletMnemonic = mnemonic;
    if (!isImportWallet) {
      walletMnemonic = generateMnemonic();
    }

    // Validate the mnemonic
    if (isImportWallet && !validateMnemonic(walletMnemonic)) {
      setError("Invalid mnemonic. Please ensure it has 12 or 24 words.");
      setMnemonic("");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    try {
      // Create the wallet
      const wallet = await GnoWallet.fromMnemonic(walletMnemonic);
      console.log("Wallet created successfully:", wallet);

      // Encrypt and store the mnemonic with the password
      const derivedKey = await deriveKey(password, "never_try_coke_and_mentos_together");
      const encryptedMnemonic = await encryptMnemonic(derivedKey, walletMnemonic);

      // Save the encrypted mnemonic to IndexedDB
      await saveEncryptedMnemonicToIndexedDB(encryptedMnemonic);

      // Initialize the wallet in Actions
      const actions = await Actions.getInstance();
      actions.setWallet(wallet);
      actions.connectWallet();
      await actions.setFaucetToken("flippando");
      await getGNOTBalances(dispatch)
      await fetchUserFLIPBalances(dispatch)
      dispatch(setUserLoggedStatus("1"));

    } catch (err) {
      setError("Failed to create wallet. Please check your mnemonic.");
      setMnemonic("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <FormControl>
      <FormLabel>Set Password *</FormLabel>
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
      <FormControl display="flex" alignItems="center" mt={4}>
        <FormLabel htmlFor="import-wallet" mb="0">
          I want to import my own wallet
        </FormLabel>
        <Switch
          id="import-wallet"
          isChecked={isImportWallet}
          onChange={(e) => setIsImportWallet(e.target.checked)}
        />
      </FormControl>

      {isImportWallet && (
        <>
          <Textarea
            placeholder="Enter your 12 or 24-word mnemonic"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            mt={4}
          />
          <Text fontSize="xs" color="gray.100" mt={2}>
            Your wallet passphrase is securely stored in your browser and never leaves your device.
          </Text>
        </>
      )}

      {error && <Text color="red.200" mt={2}>{error}</Text>}

      <Button mt={4}
      style={{ width: '100%' }} 
      bg={"purple.900"}
      border="0px"
      marginTop={10}
      borderColor="purple.600"
      borderRadius="lg"
      color="gray.100"
      fontWeight="bold"
      _hover={{bg: "purple.900"}}
      onClick={handlePasswordSetup}>
        Join Flippando
      </Button>
          <Text fontSize="xs" color="gray.100" mt={2}>
            * This password is your only entry point to the game. It is not saved anywhere, so it cannnot be recovered, in case you lose it. Make sure you store this securely.
          </Text>
    </FormControl>
  );
}

export default PasswordSetupForm;
