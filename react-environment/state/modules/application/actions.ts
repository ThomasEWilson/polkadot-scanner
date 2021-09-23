import { createAction } from '@reduxjs/toolkit';

export const setTheme = createAction<{ theme: string }>('application/setTheme');

export const setTitle = createAction<{ title: string }>('application/setTitle');

export const setUser = createAction<{ user: boolean }>('application/setUser');

export const setSubscanBaseUrl = createAction<{ subscanBaseUrl: string }>('application/setSubscanBaseUrl');

export const setLoadingStatus = createAction<{ loadingStatus: string }>('application/setLoadingStatus');

export const setModalvisible = createAction<{ key: string; visible: boolean; data?: Record<string, any> }>(
  'application/setModalvisible'
);
