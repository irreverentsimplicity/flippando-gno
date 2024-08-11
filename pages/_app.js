/* pages/_app.js */
import '../styles/globals.css'
import styles from '../styles/Home.module.css'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';



function MyApp({ Component, pageProps }) {
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
    </PersistGate>
    </Provider>
  )
}

export default MyApp