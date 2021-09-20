// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Header } from '@polkadot/types/interfaces';

import React, {useState} from 'react';

import { useApi } from '/react-environment/state/modules/api/hooks';
import useSubscription from '/lib/useSubscription';
import { switchMap } from 'rxjs';

interface Props {
  className?: string;
  label?: React.ReactNode;
}

function BestHash ({ className = '', label }: Props): React.ReactElement<Props> {
  const api = useApi()
  const [newHeader, setHeader] = useState<Header>();
  
  useSubscription(() =>
    api.isReady
      .pipe(
        switchMap((api) => 
            api.rpc.chain.subscribeNewHeads()
        )
      )
      .subscribe({
        next: (h) => setHeader(h),
        error: (e) => console.error(e),
        complete: () => console.log('Event Complete: Switching Providers or Losing connection to Node')
      }
    ), [api]
  )


  return (
    <div className={className}>
      {newHeader?.hash.toHex()}
    </div>
  );
}

export default React.memo(BestHash);
