// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Table, Card } from '/ui-components';
import { Row, Col } from 'antd'
import { formatNumber } from '@polkadot/util';

import Event from './Event';








const TableHeaderCell = styled(Table.Cell)`
  text-transform: uppercase;
`;

const TableCell = styled(Table.Cell)`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

// const ListCol = styled(Col)`
//   display: flex;
// `;


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





<Row gutter={[24, 25]}>
  <Col span={24}>
    <Card variant='gradient-border'>
      <Card.Header>
        {'Pool Information'}
      </Card.Header>
      <Card.Content>
        <Table>
          <Table.Header>
            <Table.Row>
              <TableHeaderCell align='left'>{'Pool Bootstraps'}</TableHeaderCell>
              <TableHeaderCell>{'Status'}</TableHeaderCell>
              <TableHeaderCell>{'Current Ratio'}</TableHeaderCell>
              <TableHeaderCell>{'Current Position'}</TableHeaderCell>
              <TableHeaderCell>{'Closes'}</TableHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {pools.map((pool, i) => {
              const share = getPoolShare(pool);
              const [ratio1, ratio2] = getPoolRatio(pool);

              const closes = pool.status === 'provisioning'
                ? (expectedBlockTime * (pool as ProvisioningPool).notBefore) -
                (expectedBlockTime * currentBlock)
                : 0;

              return (<Table.Row key={i}>
                <TableCell align='left'>{getTokenName(pool.currency1.token)}-{getTokenName(pool.currency2.token)}</TableCell>
                <TableCell>
                  <FlexBox alignItems='center'
                    justifyContent='flex-end'>
                    <Status className={pool.status}>
                      {pool.status === 'enabled' ? 'ENABLED' : ''}
                      {pool.status === 'provisioning' ? 'PROVISIONING' : ''}
                    </Status>
                  </FlexBox>
                </TableCell>
                <TableCell>
                  <FormatBalance balance={ratio1}
                    decimalLength={5}
                    token={pool.currency1.token} /> : <FormatBalance balance={ratio2}
                      decimalLength={5}
                      token={pool.currency2.token} />
                </TableCell>
                <TableCell>
                  <FormatBalance balance={pool.currency1.balance}
                    decimalLength={5}
                    token={pool.currency1.token} /> : <FormatBalance balance={pool.currency2.balance}
                      decimalLength={5}
                      token={pool.currency2.token} />
                </TableCell>
                <TableCell>
                  {closes
                    ? dayjs().to(dayjs().add(closes, 'milliseconds'))
                    : 'Closed'
                  }
                </TableCell>
              </Table.Row>);
            })}
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  </Col>
</Row>