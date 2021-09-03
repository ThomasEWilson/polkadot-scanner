import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import React, { memo } from 'react';

import { applicationReducer } from './modules/application/reducers';
import { apiReducer } from './modules/api/reducers';
import { ApiSideEffect } from './modules/api/components/SideEffect';

export * from './modules/application';
export * from './modules/api';

export const store = configureStore({
  middleware: [...getDefaultMiddleware({ serializableCheck: false })],
  reducer: {
    application: applicationReducer,
    api: apiReducer,
  }
});

export type StoreState = ReturnType<typeof store.getState>;

export type StoreDispatch = typeof store.dispatch;

export const StateSideEffect = memo(() => {
  return (
    <>
      <ApiSideEffect />
    </>
  );
});

StateSideEffect.displayName = 'StateUpdator';
