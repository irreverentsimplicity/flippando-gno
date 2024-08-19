import { Input, Button, FormControl, FormLabel } from "@chakra-ui/react";
import { useState } from "react";

const LogInForm = () => {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle decryption and login
    console.log("Attempt to log in with password: ", password);
  };

  return (
    <FormControl>
      <FormLabel>Password</FormLabel>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button mt={4} onClick={handleLogin}>
        Log in
      </Button>
    </FormControl>
  );
}

export default LogInForm;
