import { Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody } from "@chakra-ui/react";
import { useState } from "react";
import PasswordLoginForm from './PasswordLoginForm';
import PasswordSetupForm from './PasswordSetupForm';

const PasswordProtectedLogin = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasPassword, setHasPassword] = useState(false); // Mocking the check for saved password

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div>
      <Button onClick={toggleDrawer}>{hasPassword ? "Log in" : "Set up Password"}</Button>

      <Drawer isOpen={isDrawerOpen} placement="right" onClose={toggleDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{hasPassword ? "Log In" : "Set up Password"}</DrawerHeader>

          <DrawerBody>
            {hasPassword ? <PasswordLoginForm /> : <PasswordSetupForm />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default PasswordProtectedLogin;
