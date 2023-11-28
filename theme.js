// theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bgGradient: 'linear(to-tr, purple.400, purple.900)', 
        color: 'white',
      },
    },
  },
});

export default theme;
