import { createReducer } from '@reduxjs/toolkit';

import { setModalvisible, setSubscanBaseUrl, setTheme, setTitle } from './actions';
import { ApplicationState } from './types';

const initState: ApplicationState = {
  modal: {},
  subscanBaseUrl: '',
  theme: 'default',
  title: ''
};

export const applicationReducer = createReducer(initState, (builder) => {
  return builder.addCase(setTheme, (state, action) => {
    state.theme = action.payload.theme;
  }).addCase(setSubscanBaseUrl, (state, action) => {
    state.subscanBaseUrl = action.payload.subscanBaseUrl;
  }).addCase(setTitle, (state, action) => {
    state.title = action.payload.title;
  }).addCase(setModalvisible, (state, action) => {
    const { data, key, visible } = action.payload;

    state.modal = {
      ...state.modal,
      [key]: { data: data || state.modal?.[key]?.data || undefined, visible }
    };
  });
});
