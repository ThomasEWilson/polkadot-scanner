import React from 'react'
import type { AppProps } from 'next/app'
import { PolkascanProvider } from '../react-environment/PolkascanProvider'
import '../styles/Home.module.css';

import { config, sidebarConfig } from '../react-environment/config';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <PolkascanProvider config={config}
                        sidebarConfig={sidebarConfig}
                        router={router}>
      <Component {...pageProps} />
    </PolkascanProvider>
  )

}
export default MyApp

