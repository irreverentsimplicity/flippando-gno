import React from "react";
import { Flex, Box, Text, Spacer, Image } from '@chakra-ui/react';
import { useSelector } from "react-redux";
import PasswordProtectedLogin from './PasswordProtectedLogin';
import Wallet from "./Wallet";


const Header = ({ userBalances, userGnotBalances }) => {
    const userLoggedIn = useSelector(state => state.flippando.userLoggedIn);

    return (
        <Flex align="center" p="3" bg="transparent" boxShadow="sm" alignItems="flex-start">
          <Box display="flex" alignItems="flex-start" flexDirection={"column"}>
            <Text fontSize="5xl" fontWeight="bold">Flippando</Text>
            <Text fontSize="xs" fontWeight="italic">Estoy flippando en colores</Text>
          </Box>
          <Spacer />
          {userLoggedIn === "1" ? <Wallet /> : <PasswordProtectedLogin />}
        </Flex>
      );
}

export default Header