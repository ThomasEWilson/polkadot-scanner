import React, { FC } from 'react'
import Head from 'next/head'
import { Page } from './restyled/Page'
import { Sidebar, PageContent, PageTitle, FlexBox } from './';
import { WaitApiIsReady } from '../react-environment/state/modules/api/components/WaitApiIsReady';
import { useTitle } from '../react-environment/state/modules/application/hooks';
import { SidebarConfig } from './types';


export type Props = React.PropsWithChildren<{
  sidebar: SidebarConfig;
}>;

// Layout now wraps the whole app, around Component.
export default function Layout({ children, sidebar }: Props) {
  const title = useTitle();

  return (
    <>
      <Head>
        <title>Polkascanner Challege</title>
        <meta name="description" content="Challenge: Scanner for Polkadot Blockchain" />
      </Head>

      <Page>
        <Sidebar
          config={sidebar}
          showAccount={false}
        />
        <PageContent>
          <WaitApiIsReady
            render={() => {
              return (
                <>
                  <PageTitle>
                    <PageTitle.Content>
                      {title}
                    </PageTitle.Content>
                  </PageTitle>
                  {children}
                </>
              );
            }}
          />
        </PageContent>
      </Page>
    </>
  )

};
