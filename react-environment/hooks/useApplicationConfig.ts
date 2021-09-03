import { useMemo } from 'react';

import ApplicationConfig from '../types';

export const useApplicationConfig = (config: ApplicationConfig): ApplicationConfig | undefined => {
  return useMemo(() => {
    return {
      ...config,
    } as ApplicationConfig;
  }, [config]);
};
