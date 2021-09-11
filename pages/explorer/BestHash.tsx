// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Header } from '@polkadot/types/interfaces';

import React, {useState} from 'react';

// import { useApi, useCall } from '@polkadot/react-hooks';
// import { useCall } from '/lib/useCall';
import { useApi } from '/react-environment/state/modules/api/hooks';
import { switchMap } from 'rxjs';

interface Props {
  className?: string;
  label?: React.ReactNode;
}

function BestHash ({ className = '', label }: Props): React.ReactElement<Props> {
  const api = useApi()
  const [newHeader, setHeader] = useState<any>();
  
  api.isReady
     .pipe(
       switchMap((api) => 
           api.rpc.chain.subscribeNewHeads()
       )
     )
     .subscribe({
      next: (h) => setHeader(h),
      error: (e) => console.error(e),
      complete: () => console.log('Event: Switching Providers or Losing connection to Node')
     });

  return (
    <div className={className}>
      {label || ''}{newHeader?.hash.toHex()}
    </div>
  );
}

export default React.memo(BestHash);
