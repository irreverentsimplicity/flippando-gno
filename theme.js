// theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bgGradient: 'linear(to-tr, cyan.200, purple.900)', 
        color: 'white',
      },
    },
  },
});

export default theme;
