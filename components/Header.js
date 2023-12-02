import React from "react";
import { Flex, Box, Text, Spacer, Image } from '@chakra-ui/react';
import Wallet from "./Wallet";


const Header = ({ userBalances }) => {
    return (
        <Flex align="center" p="4" bg="transparent" boxShadow="sm">
          <Box display="flex" alignItems="flex-start" flexDirection={"column"}>
            <Text fontSize="3xl" fontWeight="bold">Flippando</Text>
            <Text fontSize="xs" fontWeight="italic">Estoy flippando en colores</Text>
          </Box>
          <Spacer />
          <Wallet userBalances={userBalances} />
        </Flex>
      );
}

export default Header