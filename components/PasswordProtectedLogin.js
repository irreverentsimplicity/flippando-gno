import { Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody } from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import PasswordLoginForm from './PasswordLoginform';
import PasswordSetupForm from './PasswordSetupForm';

const PasswordProtectedLogin = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasPassword, setHasPassword] = useState(true); // Mocking the check for saved password
  const userLoggedIn = useSelector(state => state.flippando.userLoggedIn);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div>
      <Button onClick={toggleDrawer}
        style={{ width: '100%' }} 
        bg={"purple.900"}
        border="0px"
        marginTop={10}
        borderColor="purple.600"
        borderRadius="lg"
        color="gray.100"
        fontWeight="bold"
        _hover={{bg: "purple.800"}}
      
      >{userLoggedIn === "0" ? "Log in to play" : "Join Flippando"}</Button>

      <Drawer isOpen={isDrawerOpen} placement="right" onClose={toggleDrawer}>
        <DrawerOverlay />
        <DrawerContent
        bgGradient="linear(to-br, purple.900, purple.600)">
          <DrawerCloseButton />
          <DrawerHeader>{userLoggedIn === "0" ? "Log in to play" : "Join Flippando"}</DrawerHeader>

          <DrawerBody>
            {userLoggedIn === "0" ? <PasswordLoginForm /> : <PasswordSetupForm />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default PasswordProtectedLogin;
