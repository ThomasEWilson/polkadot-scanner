// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '../types';
import type { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { Table } from '/ui-components';
import { useApi } from '/react-environment/state/modules/api/hooks';

import ExtrinsicDisplay from './Extrinsic';

interface Props {
  blockNumber?: BlockNumber;
  className?: string;
  events?: KeyedEvent[];
  label?: React.ReactNode;
  value?: Extrinsic[] | null;
}

function Extrinsics ({ blockNumber, className = '', events, label, value }: Props): React.ReactElement<Props> {
  const api = useApi();
  api.registry
  const header = useMemo(() => [
    [label || 'extrinsics', 'start', 2],
    ['events', 'start media--1000', 2],
    ['weight', 'media--1400'],
    ['signer', 'address media--1200']
  ], [label]);

  return (
    <Table
      className={className}
    >
      <Table.Header>
        {header}
      </Table.Header>
      <Table.Body>
        {value?.map((extrinsic, index): React.ReactNode =>
          <ExtrinsicDisplay
            blockNumber={blockNumber}
            events={events}
            index={index}
            key={`extrinsic:${index}`}
            maxBlockWeight={api.consts.system.blockWeights.maxBlock}
            value={extrinsic}
          />
        )}
      </Table.Body>
    </Table>
  );
}

export default React.memo(Extrinsics);
