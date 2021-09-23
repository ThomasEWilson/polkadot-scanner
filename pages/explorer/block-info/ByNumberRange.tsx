// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockHash, BlockNumber, Hash } from '@polkadot/types/interfaces';

import React, { useState, useEffect } from 'react';

import { Loading } from '/ui-components/loading/Loading';
import { useApi } from '/react-environment/state/modules/api/hooks';
import { useIsMountedRef, useBlockHashPair } from '/lib'
import BlockByHash from './ByHash';
import { isNull, isUndefined } from 'lodash';
import { AnyNumber } from '@polkadot/types/types';

interface Props {
  from: BlockNumber | AnyNumber;
  to: BlockNumber | AnyNumber;
}

export const notNullUndefined = (arg: any) => !isUndefined(arg) && !isNull(arg)

function BlockByNumberRange({ from, to }: Props): React.ReactElement<Props> | null {
  const api = useApi();
  const mountedRef = useIsMountedRef();
  const [getBlockHash, setState] = useState<[Hash, Hash] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const blockHashRange = useBlockHashPair({from, to});
  
  useEffect((): void => {
    if (notNullUndefined(blockHashRange) && (blockHashRange?.length)) {
      setState([blockHashRange[0], blockHashRange[1]])
    }
  }, [blockHashRange, mountedRef]);

  // if ((!getBlockHash || getBlockHash?.length) && !error) {
  //   return <Loading />;
  // }

  return (
    <BlockByHash
      error={error}
      from={getBlockHash?.length ? getBlockHash[0].toHex() : null}
      to={getBlockHash?.length ? getBlockHash[1].toHex() : null}
    />
  );
}

export default React.memo(BlockByNumberRange);
