// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Table } from '/ui-components';
import { formatNumber } from '@polkadot/util';

import Event from './Event';

interface Props {
  className?: string;
  events?: KeyedEvent[];
  eventClassName?: string;
  label?: React.ReactNode;
}

function Events({ className = '', eventClassName, events, label }: Props): React.ReactElement<Props> {

  const header = useMemo(() => [
    [label || 'recent events', 'start']
  ], [label]);

  return (
    <Table
      className={className}
    >
      <Table.Header>
        {header}
      </Table.Header>
      <Table.Body>
        {events && events.map(({ blockHash, blockNumber, indexes, key, record }): React.ReactNode => (
          <Table.Row
            className={eventClassName}
            key={key}
          >
            <Table.Cell className='overflow'>
              <Event value={record} />
              {blockNumber && (
                <div className='event-link'>
                  {indexes.length !== 1 && <span>({formatNumber(indexes.length)}x)&nbsp;</span>}
                  <span>{formatNumber(blockNumber)}-{indexes[0]}</span>
                </div>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default React.memo(styled(Events)`
  td.overflow {
    position: relative;

    .event-link {
      position: absolute;
      right: 0.75rem;
      top: 0.5rem;
    }
  }
`);
