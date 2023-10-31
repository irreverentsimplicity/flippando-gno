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
import Menu from '../components/Menu';
import Image from 'next/image';
import logo from "./assets/logo.png"



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
      {/*
      <nav className="border-b p-6">
        <div className='flex justify-between items-center'>
        <Image src={logo} alt="logo" width={100} height={100} layout='fixed'/>
        <div className="font-extrabold mb-4 flex justify-center font-quantico text-[5rem] text-[#000] text-center">Flippando</div>
        </div>
        <div className="flex justify-center items-center gap-3 font-quantico">
          <Link href="/">
            <a className={`${pathname === '/' ? 'on' : 'off'}`}>
              <p>Home</p>
            </a>
          </Link>
          <Link href="/flip">
          <a className={`${pathname === '/flip' ? 'on' : 'off'}`}>
              Flip
            </a>
          </Link>
          <Link href="/my-flips">
          <a className={`${pathname === '/my-flips' ? 'on' : 'off'}`}>
              My Flips
            </a>
          </Link>
          <Link href="/playground">
          <a className={` ${pathname === '/playground' ? 'on' : 'off'}`}>
              Playground
            </a>
          </Link>
          <Link href="/my-art">
            <a className={` ${pathname === '/my-art' ? 'on' : 'off'}`}>
              My Art
            </a>
          </Link>
        </div>
      </nav>
      */}
      <Menu />
      <Component {...pageProps} />
    </div>
    </DndProvider>
    </Provider>
  )
}

export default MyApp