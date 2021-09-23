import React, { useState, useEffect } from 'react'
import type { BlockHash, BlockNumber, Hash } from '@polkadot/types/interfaces';

import { useApi } from '/react-environment/state/modules/api/hooks';
import { lastValueFrom, switchMap } from 'rxjs';
import { useIsMountedRef } from './useIsMountedRef';
import { AnyNumber } from '@polkadot/types/types';
import { useSubscription } from '.';

interface Props { 
    from: BlockNumber | AnyNumber | undefined;
    to: BlockNumber | AnyNumber | undefined;
}
export function useBlockHashPair({from, to}: Props): [Hash,Hash] | [] {
  const api = useApi();
  const mountedRef = useIsMountedRef();
  const [blockHashRange, setBlockHashRange] = useState<[Hash, Hash] | []>([]);
  
    useEffect((): void => {
        from && to && Promise
          .all([
            lastValueFrom(api.rpc.chain.getBlockHash(from)),
            lastValueFrom(api.rpc.chain.getBlockHash(to))
          ])
          .then(([from, to]): void => {
            mountedRef.current && setBlockHashRange([from, to]);
          })
          .catch((error: Error): void => {
            console.error(error)
          });
      }, [api, mountedRef, from, to]);

    return blockHashRange;
}


export default function useBlockHashRange(hash, hash2): Hash[] | any[] | undefined {
    const api = useApi();
    const [blockHashRange, setBlockHashRange] = useState<Hash[] | any[] | undefined>([]);

    useSubscription(() => 
        api.isReady
            .pipe(
                switchMap((api) => 
                    api.query.system.blockHash.range([hash, hash2])
                )
            )
            .subscribe({
                next: (hashRange) => {
                    const range = hashRange.flatMap(([hash, codec]) => hash)
                    setBlockHashRange(range?.length ? range : [])
                },
                error: (e) => console.error(e),
                complete: () => console.log('Event Complete: Switching Providers or Losing connection to Node')
            }
        ), [api]
    )
    return blockHashRange;
}

// useSubscription(() => 
//     api.isReady
//         .pipe(
//             switchMap((api) => 
//                 api.queryMulti([
//                     [api.query.system.blockHash, from],
//                     [api.query.system.blockHash, to]
//                 ])
//             )
//         )
//     .subscribe({
//         next: ([from, to]) => mountedRef && setState([from.hash, to.hash]),
//         error: (e) => setError(e),
//         complete: () => console.log('Event Complete: Switching Providers or Losing connection to Node')
//     }
// ), [api, mountedRef, from, to]);


// api.query.system.blockHash.range([hash, hash2])
// 