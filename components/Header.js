import React from "react";
import { Flex, Box, Text, Spacer, Image } from '@chakra-ui/react';
import Wallet from "./Wallet";


const Header = ({ userBalances, userGnotBalances }) => {
    return (
        <Flex align="center" p="3" bg="transparent" boxShadow="sm" alignItems="flex-start">
          <Box display="flex" alignItems="flex-start" flexDirection={"column"}>
            <Text fontSize="5xl" fontWeight="bold">Flippando</Text>
            <Text fontSize="xs" fontWeight="italic">Estoy flippando en colores</Text>
          </Box>
          <Spacer />
          <Wallet userBalances={userBalances} userGnotBalances={userGnotBalances} />
        </Flex>
      );
}

export default Header