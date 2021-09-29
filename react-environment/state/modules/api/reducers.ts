import { createReducer } from '@reduxjs/toolkit';

import { setApi, setEndpoints, setIsError, setIsLoading, setIsReady, setFirstEndpoint} from './actions';
import { ApiState } from './types';

export const initState: ApiState = {
  api: undefined,
  endpoints: {},
  firstEndpoint: {},
  isError: false,
  isLoading: false,
  isReady: false,
};

export const apiReducer = createReducer(initState, (builder) => {
  return builder.addCase(setEndpoints, (state, action) => {
    state.endpoints = action.payload.endpoints;
  }).addCase(setFirstEndpoint, (state, action) => {
    state.firstEndpoint = action.payload.firstEndpoint;
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
