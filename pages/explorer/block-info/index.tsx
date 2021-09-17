// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

import { isHex } from '@polkadot/util';
import { useApi } from '/react-environment/state/modules/api/hooks';
import useSubscription from '/lib/useSubscription';
import { switchMap } from 'rxjs';


import Query from '../Query';
import BlockByHash from './ByHash';
import BlockByNumber from './ByNumber';
import { BlockNumber } from '@polkadot/types/interfaces';

function Entry (): React.ReactElement | null {
  const api = useApi();
  const { value } = useParams<{ value: string }>();
  const [bestNumber, setBestNumber] = useState<BlockNumber>();
  const [stateValue, setStateValue] = useState<string | undefined>(value);

  useSubscription(() =>
    api.isReady
      .pipe(
        switchMap((api) => 
          api.derive.chain.bestNumber()
        )
      )
      .subscribe({
        next: (h) => setBestNumber(h),
        error: (e) => console.error(e),
        complete: () => console.log('')
      }
    ), [api]
  )


  useEffect((): void => {
    setStateValue((stateValue) =>
      value && value !== stateValue
        ? value
        : !stateValue && bestNumber
          ? bestNumber.toString()
          : stateValue
    );
  }, [bestNumber, value]);

  if (!stateValue) {
    return null;
  }

  const Component = isHex(stateValue)
    ? BlockByHash
    : BlockByNumber;

  return (
    <>
      <Query />
      <Component
        key={stateValue}
        value={stateValue}
      />
    </>
  );
}

export default React.memo(Entry);
