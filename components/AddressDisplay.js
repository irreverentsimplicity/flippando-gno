import { HStack, Text, IconButton, useToast } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

 const AddressDisplay = ({ address }) => {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    toast({
      title: 'Copied to clipboard!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <div className="col-span-5 flex justify-end pl-10 pb-1 pt-1">
      <HStack>
        <Text fontSize="xs">{address}</Text>
        <CopyToClipboard text={address} onCopy={handleCopy}>
          <IconButton
            icon={<CopyIcon />}
            size="xs"
            bg="purple.700"           
            color="white"            
            _hover={{ bg: 'purple.600' }} 
            _active={{ bg: 'purple.700' }} 
            aria-label="Copy Address"
          />
        </CopyToClipboard>
      </HStack>
    </div>
  );
}

export default AddressDisplay;
