import { BareProps } from '../ui-components/types';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { ApiRx, WsProvider } from '@polkadot/api';
import { useEndpoints } from './state/modules/api/hooks';

export interface ApiContextData {
  connected: boolean;
  error: boolean;
  getApi: () => ApiRx;
}

export const ApiContext = React.createContext<ApiContextData>({} as any as ApiContextData);

const POLKAENDPOINT = 'wss://rpc.polkadot.io';

export const ApiProvider: FC<BareProps> = ({ children }) => {
  const [api, setApi] = useState<ApiRx>();
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const endpoints = useEndpoints();
  // const firstEndpoint = useFirstEndpoint();
  // get endpoints from appConfigState

  useEffect(() => {

    let _endpoints: string[] = [];

      // clear first endpoint
    _endpoints = Object.values(endpoints);

    const wsProvider = new WsProvider(_endpoints);

    const subscriber = ApiRx.create({ provider: wsProvider }).subscribe({
      error: () => {
        setError(true);
        setConnected(false);
      },
      next: (api: ApiRx) => {
        setApi(api);
        setConnected(true);
        setError(false);
      }
    });

    return (): void => {
      subscriber.unsubscribe();
    };
  }, []);

  const getApi = useCallback((): ApiRx => {
    return api as ApiRx;
  }, [api]);

  return (
    <ApiContext.Provider value={{
      connected,
      error,
      getApi
    }}>
      {children}
    </ApiContext.Provider>
  );
};
