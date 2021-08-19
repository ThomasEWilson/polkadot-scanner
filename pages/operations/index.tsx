import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'

const operations: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Polkadot Blockchain Scanner </title>
        <meta name="description" content="Challenge: Scanner for Polkadot Blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        Friendly Polkadot Scanner 
        </h1>

        {/* <p className={styles.description}>
          Get started by editing{'  '}
          <code className={styles.code}>pages/index.js</code>
        </p> */}

        <div className={styles.grid}>
          <a href="#" className={styles.card}>
            <h2>Fields &rarr;</h2>
            <p>Adding functionality here</p>
          </a>

          <a href="#" className={styles.card}>
            <h2>Scan &rarr;</h2>
            <p>Checking out how to be useful</p>
          </a>

          <a
            href="#"
            className={styles.card}
          >
            <h2>Table for Results &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="#"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Deploy to IPFS, potentially stand up a server.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <h3>arranged by: <code className={styles.code}>Thomas E Wilson</code></h3>
      </footer>
    </div>
  )
}

export default operations
