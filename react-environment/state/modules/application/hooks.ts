import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { StoreDispatch, StoreState } from '../../index';
import { setModalvisible, setTheme, setTitle, setUser, setLoadingStatus } from './actions';

export const useTitle = () => {
  return useSelector((state: StoreState) => state.application.title);
};

export const useSetTitle = () => {
  const dispatch = useDispatch<StoreDispatch>();

  return useCallback((title: string) => {
    dispatch(setTitle({ title }));
  }, [dispatch]);
};

export const useLoadingStatus = () => {
  return useSelector((state: StoreState) => state.application.loadingStatus);
};

export const useSetLoadingStatus = () => {
  const dispatch = useDispatch<StoreDispatch>();

  return useCallback((loadingStatus: string) => {
    dispatch(setLoadingStatus({ loadingStatus }));
  }, [dispatch]);
};

export const useUser = () => {
  return useSelector((state: StoreState) => state.application.user);
};

export const useSetUser = () => {
  const dispatch = useDispatch<StoreDispatch>();

  return useCallback((user: boolean) => {
    dispatch(setUser({ user }));
  }, [dispatch]);
};

export const useTheme = () => {
  return useSelector((state: StoreState) => state.application.theme);
};

export const useSetTheme = () => {
  const dispatch = useDispatch<StoreDispatch>();

  return useCallback((theme: string) => {
    dispatch(setTheme({ theme }));
  }, [dispatch]);
};

export const useResolveSubscanUrl = () => {
  const baseUrl = useSelector((state: StoreState) => state.application.subscanBaseUrl);

  return useCallback((urlComponent: string) => {
    if (!baseUrl) return '';

    return new URL(urlComponent, baseUrl).href;
  }, [baseUrl]);
};

export const useModal = (key: string) => {
  return useSelector((state: StoreState) => state?.application?.modal?.[key]?.visible ?? false);
};

export const useModalWithData = <T extends Record<string, any>>(key: string) => {
  return useSelector((state: StoreState) => (state?.application?.modal?.[key] ?? { data: {}, visible: false }) as { visible: boolean, data: T });
};

export const useModalAction = (key: string, withData = false) => {
  const dispatch = useDispatch<StoreDispatch>();

  const show = useCallback((data?: Record<string, any>) => dispatch(setModalvisible({ data: withData ? data : undefined, key, visible: true })), [dispatch, key, withData]);
  const hide = useCallback((data?: Record<string, any>) => dispatch(setModalvisible({ data: withData ? data : undefined, key, visible: false })), [dispatch, key, withData]);

  return [show, hide];
};
