import { StoreDispatch } from '../../..';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ApiRx, WsProvider } from '@polkadot/api';

import { setIsError, setIsLoading, setIsReady } from '../actions';
import { useApi, useEndpoints, useFirstEndpoint, useSetApi } from '../hooks';

export const ApiSideEffect = () => {
  const currentApi = useApi(true);
  const endpoints = useEndpoints();
  const setApi = useSetApi();
  const dispatch = useDispatch<StoreDispatch>();
  const endpointsRef = useRef<any>(endpoints);
  const firstEndpoint = useFirstEndpoint();
  // update current API ONLY IF:
  // 1. Endpoints array has at least 1 endpoints
  // 2. or if the number of endpoints changes, or another changes.
  useEffect(() => {
    if (currentApi || Object.values(endpoints).length === 0) return;
    dispatch(setIsLoading({ value: true }));

    let _endpoints: string[] = Object.values(endpoints)
    if (firstEndpoint)
      _endpoints = [...Object.values(firstEndpoint), ..._endpoints];

    const provider = new WsProvider(_endpoints);

    const api = ApiRx.create({provider}).subscribe({
      error: (): void => {
        dispatch(setIsError({ value: true }));
        dispatch(setIsLoading({ value: false }));
      },
      next: (api): void => {
        dispatch(setIsError({ value: false }));
        dispatch(setIsLoading({ value: false }));
        setApi(api);
        dispatch(setIsReady({ value: true }));
      }
    });

    return () => api.unsubscribe();
  }, [setApi, dispatch, currentApi, endpoints, endpointsRef]);

  return null;
};
