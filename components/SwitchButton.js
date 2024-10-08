import { Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';

const SwitchButton = ({ setAssistiveImage, assistiveImage }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onModalClose = () => {
        setAssistiveImage(true)
        onClose()
    }
  
    return (
      <Box display="flex" flexDirection="row" width="100%" mb={10} justifyContent="flex-start">
        <Button
          onClick={() => setAssistiveImage(true)}
          bg={assistiveImage ? "purple.900" : "purple.600"}
          color="white"
          fontSize="sm"
          _hover={{ bg: assistiveImage ? "purple.600" : "purple.900" }}
          borderRightRadius={0}
          borderLeftRadius="md"
          mr={0}
        >
          Playground (test) Airdrop
        </Button>
        <Button
          onClick={() => setAssistiveImage(true)}
          bg={assistiveImage ? "purple.900" : "purple.600"}
          color="white"
          fontSize="sm"
          _hover={{ bg: assistiveImage ? "purple.600" : "purple.900" }}
          borderRightRadius={0}
          borderLeftRadius={0}
          mr={0}
        >
          Hackerville Airdrop
        </Button>
        <Button
          onClick={() => {
            setAssistiveImage(false);
            onOpen();
          }}
          bg={!assistiveImage ? "purple.900" : "purple.600"}
          color="white"
          fontSize="sm"
          _hover={{ bg: !assistiveImage ? "purple.600" : "purple.900" }}
          borderLeftRadius={0}
          borderRightRadius="md"
        >
          Gnomeverse Airdrop
        </Button>
  
        <Modal isOpen={isOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent bg="purple.800" color="white">
          <ModalHeader>Coming Soon</ModalHeader>
          <ModalCloseButton bg="white" color="purple.800" />
          <ModalBody>
            Gnomeverse airdrop is not yet live. Patience.
          </ModalBody>
          <ModalFooter>
            <Button bg="white" color="purple.800" onClick={onModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Box>
    );
  };

export default SwitchButton;
