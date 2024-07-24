import React from 'react';
import { useRouter } from 'next/router';
import { Box, Link as ChakraLink, VStack, Spacer } from '@chakra-ui/react';


import Link from 'next/link';

const MenuItem = ({ href, children }) => {
  const router = useRouter();
  const isCurrentPage = router.pathname === href;

  return (
    <Link href={href} passHref>
      <ChakraLink 
        style={{ width: '100%' }} 
        bg={"purple.900"}
        border="1px"
        borderColor="purple.600"
        borderRadius="lg"
        color="gray.100"
        fontWeight="bold"
        _hover={{ textDecoration: 'none' }}>
        <Box
          as="nav"
          border="0.5px"
          borderRadius="lg"
          p={2}
          _hover={{
            bg: 'purple.800',
            color: 'gray.100',
          }}
          position="relative"
          cursor="pointer"
        >
          {children}
          {isCurrentPage && (
            <Box
              position="absolute"
              right="2"
              top="50%"
              transform="translateY(-50%)"
              w="12px"
              h="12px"
              bg="purple.100"
            />
          )}
        </Box>
      </ChakraLink>
    </Link>
  );
};

const Menu = () => {
  return (
    <Box width="200px" height="80vh" bg="transparent" borderRadius="lg" p={2}  display="flex" flexDirection="column">
      <VStack align="stretch" spacing={4}>
        <MenuItem href="/flip">Flip</MenuItem>
        <MenuItem href="/canvas">Canvas</MenuItem> 
        <MenuItem href="/inventory">Inventory</MenuItem>
        <MenuItem href="/market">Marketplace</MenuItem>
      </VStack>
      <Spacer/>
      

    </Box>
  );
};

export default Menu;
