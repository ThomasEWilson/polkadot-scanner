// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash, BlockNumber } from '@polkadot/types/interfaces';

import React, { useState } from 'react';

import { Loading } from '/ui-components/loading/Loading';
import { useApi } from '/react-environment/state/modules/api/hooks';
import { useIsMountedRef, useSubscription } from '/lib'
import { switchMap } from 'rxjs';

import BlockByHash from './ByHash';

interface Props {
  from: BlockNumber;
  to: BlockNumber;
}

function BlockByNumberRange ({ from, to }: Props): React.ReactElement<Props> | null {
  const api = useApi();
  const mountedRef = useIsMountedRef();
  const [getBlockHash, setState] = useState<[Hash, Hash] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useSubscription(() => 
     api.isReady
            .pipe(
              switchMap((api) => 
                api.queryMulti([
                  [api.query.system.blockHash, from],
                  [api.query.system.blockHash, to]
                ])
              )
            )
        .subscribe({
          next: ([from, to]) => mountedRef && setState([from.hash, to.hash]),
          error: (e) => setError(e),
          complete: () => console.log('Event Complete: Switching Providers or Losing connection to Node')
        }
  ), [api, mountedRef, from, to]);

  if (!getBlockHash && !error) {
    return <Loading />;
  }

  return (
    <BlockByHash
      error={error}
      value={getBlockHash ? getBlockHash[0].toHex() : null}
    />
  );
}

export default React.memo(BlockByNumberRange);
