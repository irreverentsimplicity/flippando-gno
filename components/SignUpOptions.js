import { Button, VStack } from "@chakra-ui/react";
import { useState } from "react";
import MnemonicInputForm from './MnemonicInputForm'
import GenerateMnemonicDisplay from './GenerateMnemonicDisplay'

const SignUpOptions = () => {
  const [showInputMnemonic, setShowInputMnemonic] = useState(false);
  const [generatedMnemonic, setGeneratedMnemonic] = useState(null);

  const handleGenerateMnemonic = () => {
    // Generate mnemonic and set it to state
    const mnemonic = "example example example"; // Replace with gno-js library call
    setGeneratedMnemonic(mnemonic);
  };

  return (
    <VStack spacing={4}>
      {!showInputMnemonic && !generatedMnemonic && (
        <>
          <Button onClick={() => setShowInputMnemonic(true)}>Input your own mnemonic</Button>
          <Button onClick={handleGenerateMnemonic}>Generate new mnemonic</Button>
        </>
      )}

      {showInputMnemonic && <MnemonicInputForm />}
      {generatedMnemonic && <GenerateMnemonicDisplay mnemonic={generatedMnemonic} />}
    </VStack>
  );
}

export default SignUpOptions;
