import React, { FC, useEffect, useRef } from 'react'
import { SWRConfig } from 'swr'
import fetch from '../lib/fetchJson'
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { store, StateSideEffect, StoreDispatch } from '../react-environment/state'
import { setSubscanBaseUrl } from '../react-environment/state/modules/application/actions';
import {useSetEndpoints} from '../react-environment/state/modules/api/hooks'
import { useApplicationConfig } from '../react-environment/hooks/useApplicationConfig';
import ApplicationConfig from '../react-environment/types';
import ThemeProvider from '../ui-components/theme/ThemeProvider';
import { Layout } from '../ui-components';
import { SidebarConfig } from '/ui-components/types';



export type PolkascanProps = React.PropsWithChildren<{
    config: ApplicationConfig;
    sidebarConfig: SidebarConfig;
}>;

export const Inner: FC<PolkascanProps> = ({ children, config, sidebarConfig }) => {

    const _config = useApplicationConfig(config);
    const dispatch = useDispatch<StoreDispatch>();
    const setEndpoints = useRef(useSetEndpoints());

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


