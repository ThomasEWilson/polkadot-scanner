import React from 'react'
import type { AppProps /*, AppContext */ } from 'next/app'
import { PolkascanProvider } from '../react-environment/PolkascanProvider'
import '../styles/Home.module.css';

import { config, sidebarConfig } from '../react-environment/config';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PolkascanProvider config={config}
                        sidebarConfig={sidebarConfig}>
      <Component {...pageProps} />
    </PolkascanProvider>
  )

}
export default MyApp

