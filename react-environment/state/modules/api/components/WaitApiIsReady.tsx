import { PageLoading } from '/ui-components/loading/PageLoading';
import React, { FC, ReactElement } from 'react';

import { useApi, useApiIsReady } from '../hooks';

export const WaitApiIsReady: FC<{
  render: () => ReactElement
  loading?: () => ReactElement | null;
}> = ({ loading, render }) => {
  const api = useApi(true);
  const isReady = useApiIsReady();

  if (api?.isReady && isReady) {
    return render();
  } else {
    return loading ? loading() : <PageLoading />;
  }
};
