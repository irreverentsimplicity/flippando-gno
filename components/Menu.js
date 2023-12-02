import React from 'react';
import { useRouter } from 'next/router';
import { Box, Link as ChakraLink, VStack, Icon, Spacer } from '@chakra-ui/react';
import { FaTwitter} from 'react-icons/fa';

import Link from 'next/link';

const MenuItem = ({ href, children }) => {
  const router = useRouter();
  const isCurrentPage = router.pathname === href;

  return (
    <Link href={href} passHref>
      <ChakraLink 
        style={{ width: '100%' }} 
        color="purple.800"
        fontWeight="bold"
        _hover={{ textDecoration: 'none' }}>
        <Box
          as="nav"
          border="1px"
          borderColor="purple.100"
          borderRadius="lg"
          p={2}
          _hover={{
            bg: 'purple.800',
            color: 'white',
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
              bg="purple.800"
            />
          )}
        </Box>
      </ChakraLink>
    </Link>
  );
};

const Menu = () => {
  return (
    <Box width="200px" height="80vh" bg="gray.100" borderRadius="lg" p={2}  display="flex" flexDirection="column">
      <VStack align="stretch" spacing={4}>
        <MenuItem href="/">Home</MenuItem>
        <MenuItem href="/flip">Flip</MenuItem>
        <MenuItem href="/my-flips">My Flips</MenuItem>
        <MenuItem href="/playground">Playground</MenuItem>
        <MenuItem href="/my-art">My Art</MenuItem>
        <MenuItem href="/market">Market</MenuItem>
        <MenuItem href="/docs">What's this</MenuItem>
      </VStack>
      <Spacer/>
      <a href={'https://twitter.com/Flippand0'} target="_blank" rel="noopener noreferrer">
        <Icon as={FaTwitter} w={8} h={8} alignSelf="right" color={'#bbbbbb'}/>
      </a>

    </Box>
  );
};

export default Menu;
