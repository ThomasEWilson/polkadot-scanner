import { createReducer } from '@reduxjs/toolkit';

import { setApi, setEndpoints, setIsError, setIsLoading, setIsReady} from './actions';
import { ApiState } from './types';

export const initState: ApiState = {
  api: undefined,
  endpoints: {},
  isError: false,
  isLoading: false,
  isReady: false,
};

export const apiReducer = createReducer(initState, (builder) => {
  return builder.addCase(setEndpoints, (state, action) => {
    state.endpoints = action.payload.endpoints;
  }).addCase(setApi, (state, action) => {
    state.api = action.payload.api;
  }).addCase(setIsError, (state, action) => {
    state.isError = action.payload.value;
  }).addCase(setIsLoading, (state, action) => {
    state.isLoading = action.payload.value;
  }).addCase(setIsReady, (state, action) => {
    state.isReady = action.payload.value;
  });
});
