/* pages/_app.js */
import '../styles/globals.css'
import styles from '../styles/Home.module.css'
import "@material-tailwind/react/tailwind.css";
import Link from 'next/link'
import { Provider } from 'react-redux';
import {store} from '../store/store.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {useRouter} from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';



function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  
  return (
    <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
    <div className={styles.container}>
      <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
      />
      <link href="https://fonts.googleapis.com/css2?family=Quantico:wght@700&display=swap" rel="stylesheet"/>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </div>
    </DndProvider>
    </Provider>
  )
}

export default MyApp