import React, { FC, useEffect, useRef } from 'react'
// import Router from 'next/router';
import { SWRConfig } from 'swr'
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { store, StateSideEffect, StoreDispatch } from './state'
import { setSubscanBaseUrl } from './state/modules/application/actions';
import {useSetEndpoints} from './state/modules/api/hooks'
import { useApplicationConfig } from './hooks/useApplicationConfig';
import ApplicationConfig from './types';
import ThemeProvider from '../ui-components/theme/ThemeProvider';
import { Layout } from '../ui-components';
import { SidebarConfig } from '/ui-components/types';
import { useUser } from './state/modules/application/hooks';
import Router from 'next/router';


export type PolkascanProps = React.PropsWithChildren<{
    config: ApplicationConfig;
    sidebarConfig: SidebarConfig;
    router: any;
}>;

//check if you are on the client (browser) or server
const isBrowser = () => typeof window !== "undefined";

export const Inner: FC<PolkascanProps> = ({ children, config, sidebarConfig, router }) => {

    const _config = useApplicationConfig(config);
    const dispatch = useDispatch<StoreDispatch>();
    const setEndpoints = useRef(useSetEndpoints());
    const isUserAuthenticated = useUser();

    let unprotectedRoutes = ['/'];

    useEffect(() => {
        if (!router) return;
        
        let pathIsProtected = unprotectedRoutes.indexOf(router.pathname) === -1;
        if (isBrowser() && !isUserAuthenticated && pathIsProtected) {
            router.push('/');
        }
        else if (isBrowser() && isUserAuthenticated) {
            router.push('/explorer')
        }
    }, [router, router?.pathname, isUserAuthenticated, unprotectedRoutes]);

    useEffect(() => {
        dispatch(setSubscanBaseUrl({ subscanBaseUrl: config.subscanBaseUrl }));
    }, [dispatch, config.subscanBaseUrl]);

    useEffect(() => {
        if (!_config) return;
    
        setEndpoints.current(_config.endpoints);
      }, [_config]);

    return (
        <ThemeProvider>
            <StateSideEffect />
            <SWRConfig
                value={{
                    fetcher: fetch,
                    onError: (err) => {
                        console.error(err)
                    },
                }}
            >
                 <Layout sidebar={sidebarConfig}>
                     {children}
                 </Layout>
            </SWRConfig>
        </ThemeProvider>
  )

};

export const PolkascanProvider: FC<PolkascanProps> = (props) => {
    return (
        <ReduxProvider store={store}>
            <Inner {...props} />
        </ReduxProvider>
    )
}


