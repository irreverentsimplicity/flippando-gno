import React from 'react';
import { Box, VStack, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const MenuItem = ({ href, children }) => {
  const router = useRouter();
  const isCurrentPage = router.pathname === href;

  return (
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
    >
      <Link href={href} color="purple.800" fontWeight="bold" _hover={{ textDecoration: 'none', color: 'white' }}>
        {children}
      </Link>
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
  );
};

const Menu = () => {
  return (
    <Box width="200px" height="80vh" bg="gray.100" borderRadius="lg" p={2}>
      <VStack align="stretch" spacing={4}>
        <MenuItem href="/">Home</MenuItem>
        <MenuItem href="/flip">Flip</MenuItem>
        <MenuItem href="/my-flips">My Flips</MenuItem>
        <MenuItem href="/playground">Playground</MenuItem>
        <MenuItem href="/my-art">My Art</MenuItem>
      </VStack>
    </Box>
  );
};

export default Menu;
