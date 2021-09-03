import React from 'react'
import type { AppProps /*, AppContext */ } from 'next/app'
import { PolkascanProvider } from './PolkascanProvider'
import '../styles/Home.module.css';

import { config, sidebarConfig } from './config';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PolkascanProvider config={config}
                        sidebarConfig={sidebarConfig}>
      <Component {...pageProps} />
    </PolkascanProvider>
  )

}
export default MyApp

