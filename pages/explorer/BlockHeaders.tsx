// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import BlockHeader from './BlockHeader';

interface Props {
  headers: HeaderExtended[];
}

function BlockHeaders ({ headers }: Props): React.ReactElement<Props> {

  const headerRef = useRef([
    ['recent blocks', 'start', 3]
  ]);

  // empty={t<string>('No blocks available')}
  // header={headerRef.current}

  return (
    <Table
    >
      {headers
        .filter((header) => !!header)
        .map((header): React.ReactNode => (
          <BlockHeader
            key={header.number.toString()}
            value={header}
          />
        ))}
    </Table>
  );
}

export default React.memo(BlockHeaders);
