import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ApiRx } from '@polkadot/api';

import { StoreDispatch, StoreState } from '../..';
import { setApi, setEndpoints, setFirstEndpoint } from './actions';

export const useEndpoints = (): Record<string,string> => {
  return useSelector((state: StoreState) => state.api.endpoints);
};

export const useSetEndpoints = () => {
  const dispatch = useDispatch<StoreDispatch>();

  return useCallback((endpoints: Record<string, string>) => {
    dispatch(setEndpoints({ endpoints }));
  }, [dispatch]);
};

export const useFirstEndpoint = (): Record<string,string> => {
  return useSelector((state: StoreState) => state.api.firstEndpoint);
};

export const useSetFirstEndpoint = () => {
  const dispatch = useDispatch<StoreDispatch>();

  return useCallback((firstEndpoint: Record<string, string>) => {
    dispatch(setFirstEndpoint({ firstEndpoint }));
  }, [dispatch]);
};

export const useApi = (nullable?: boolean): ApiRx => {
  return useSelector((state: StoreState) => {
    if (nullable) return state.api.api as ApiRx;

    if (!state.api.api) throw new Error('api is not ready');

    return state.api.api;
  });
};

export const useSetApi = () => {
  const dispatch = useDispatch<StoreDispatch>();

  return useCallback((api: ApiRx) => {
    dispatch(setApi({ api }));
  }, [dispatch]);
};

export const useApiIsError = () => {
  return useSelector((state: StoreState) => state.api.isError);
};

export const useApiIsLoading = () => {
  return useSelector((state: StoreState) => state.api.isLoading);
};

export const useApiIsReady = () => {
  return useSelector((state: StoreState) => state.api.isReady);
};
