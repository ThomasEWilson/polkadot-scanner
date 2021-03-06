import { createReducer } from '@reduxjs/toolkit';

import { setModalvisible, setSubscanBaseUrl, setTheme, setTitle, setUser, setLoadingStatus } from './actions';
import { ApplicationState } from './types';

const initState: ApplicationState = {
  modal: {},
  subscanBaseUrl: '',
  theme: 'default',
  title: '',
  user: false,
  loadingStatus: 'Loading...'
};

export const applicationReducer = createReducer(initState, (builder) => {
  return builder.addCase(setTheme, (state, action) => {
    state.theme = action.payload.theme;
  }).addCase(setSubscanBaseUrl, (state, action) => {
    state.subscanBaseUrl = action.payload.subscanBaseUrl;
  }).addCase(setTitle, (state, action) => {
    state.title = action.payload.title;
  }).addCase(setUser, (state, action) => {
    state.user = action.payload.user;
  }).addCase(setLoadingStatus, (state, action) => {
    state.loadingStatus = action.payload.loadingStatus;
  }).addCase(setModalvisible, (state, action) => {
    const { data, key, visible } = action.payload;

    state.modal = {
      ...state.modal,
      [key]: { data: data || state.modal?.[key]?.data || undefined, visible }
    };
  });
});
