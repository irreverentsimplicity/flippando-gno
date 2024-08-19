import { Button, Text } from "@chakra-ui/react";

 const GeneratedMnemonicDisplay = ({ mnemonic }) => {
  const handleSaveMnemonic = () => {
    // Save and encrypt mnemonic to IndexedDB
    console.log("Saving generated mnemonic: ", mnemonic);
  };

  return (
    <div>
      <Text>Your generated mnemonic:</Text>
      <Text>{mnemonic}</Text>
      <Button mt={4} onClick={handleSaveMnemonic}>
        Save Mnemonic
      </Button>
    </div>
  );
}

export default GeneratedMnemonicDisplay;
