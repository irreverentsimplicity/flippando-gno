import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody } from "@chakra-ui/react";
import LogInForm from './LogInForm';
import SignUpOptions from './SignUpOptions';

const LoginSignupButton = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasMnemonic, setHasMnemonic] = useState(false); // Mocking the check for saved mnemonic

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div>
      <Button onClick={toggleDrawer}>Log in / Sign up</Button>

      <Drawer isOpen={isDrawerOpen} placement="right" onClose={toggleDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{hasMnemonic ? "Log In" : "Log in / Sign up"}</DrawerHeader>

          <DrawerBody>
            {/* Depending on the state of mnemonic, render different UI */}
            {hasMnemonic ? <LogInForm /> : <SignUpOptions />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default LoginSignupButton;
