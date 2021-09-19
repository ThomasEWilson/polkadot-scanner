import React, { useState } from 'react'
import type { BlockNumber } from '@polkadot/types/interfaces';

import { useApi } from '/react-environment/state/modules/api/hooks';
import { useSubscription } from '/lib'
import { switchMap } from 'rxjs';

export function useBestNumber(): BlockNumber | undefined {
    const api = useApi();
    const [bestBlockNumber, setBestBlockNumber] = useState<BlockNumber>();

    useSubscription(() => 
        api.isReady
            .pipe(
                switchMap((api) => 
                    api.derive.chain.bestNumberFinalized()
                )
            )
            .subscribe({
                next: (recentBlock) => setBestBlockNumber(recentBlock),
                error: (e) => console.error(e),
                complete: () => console.log('Event Complete: Switching Providers or Losing connection to Node')
            }
        ), [api]
    )
    return bestBlockNumber;

}