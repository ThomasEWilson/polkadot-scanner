import { createAction } from '@reduxjs/toolkit';

import { ApiRx } from '@polkadot/api';

export const setApi = createAction<{ api: ApiRx }>('api/setApi');

export const setEndpoints = createAction<{ endpoints: Record<string, string> }>('api/setEndpoints');

export const setFirstEndpoint = createAction<{ firstEndpoint: Record<string, string> }>('api/setFirstEndpoint');

export const setIsLoading = createAction<{ value: boolean }>('api/setIsLoading');

export const setIsReady = createAction<{ value: boolean }>('api/setIsReady');

export const setIsError = createAction<{ value: boolean }>('api/setIsError');

// init sdk
