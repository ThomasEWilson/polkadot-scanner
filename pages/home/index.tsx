import type { NextPage } from 'next'
import React, { useEffect, useRef } from 'react';
import useUser from '../../lib/useUser';
// import styles from '../../styles/Home.module.css'
import {Page, PageContent} from '../../ui-components/restyled'

const Home: NextPage = () => {
  // Authorization Required for Scanner Access

  // Requesting User from client, if not present redirect to Login.
  const { user } = useUser({ redirectTo: '/login' })

  // LOADING...if not Authorized yet
  if (!user || user.isLoggedIn === false) {
    return (<h1>loading...</h1>)
  }

  // POLKASCANNER Scanner Feature.
  return (
    <Page>
      <PageContent>
        <h2>Friendly Polkadot Scanner</h2>
      </PageContent>
    </Page>
  )
}

export default Home;