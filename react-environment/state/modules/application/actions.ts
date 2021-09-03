import { createAction } from '@reduxjs/toolkit';

export const setTheme = createAction<{ theme: string }>('application/setTheme');

export const setTitle = createAction<{ title: string }>('application/setTitle');

export const setSubscanBaseUrl = createAction<{ subscanBaseUrl: string }>('application/setSubscanBaseUrl');

export const setModalvisible = createAction<{ key: string; visible: boolean; data?: Record<string, any> }>(
  'application/setModalvisible'
);
