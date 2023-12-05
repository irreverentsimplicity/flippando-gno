/* eslint-disable react/no-unknown-property */
import Head from 'next/head'
import styles from '../styles/Home.module.css'


export const getServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/flip', 
      permanent: false,     
    },
  };
};

export default function Home() {

  return (
    <div className={styles.container}>
      
      <Head>
        <title>Flippando</title>
        <meta name="description" content="Entry point" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
