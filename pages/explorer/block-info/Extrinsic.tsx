// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '../types';
import type { BlockNumber, DispatchInfo, Extrinsic, Weight } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { AddressMini, Expander, Call } from '/ui-components/polkadot';
import { Table } from '/ui-components';

import { formatNumber } from '@polkadot/util';

import Event from './Event';

interface Props {
  blockNumber?: BlockNumber;
  className?: string;
  events?: KeyedEvent[];
  index: number;
  maxBlockWeight?: Weight;
  value: Extrinsic;
}



const TableCell = styled(Table.Cell)`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const BN_TEN_THOUSAND = new BN(10_000);

function getEra ({ era }: Extrinsic, blockNumber?: BlockNumber): [number, number] | null {
  if (blockNumber && era.isMortalEra) {
    const mortalEra = era.asMortalEra;

    return [mortalEra.birth(blockNumber.toBn().toNumber()), mortalEra.death(blockNumber.toBn().toNumber())];
  }

  return null;
}

function filterEvents (index: number, events: KeyedEvent[] = []): [DispatchInfo | undefined, KeyedEvent[]] {
  const filtered = events.filter(({ record: { phase } }) =>
    phase.isApplyExtrinsic &&
    phase.asApplyExtrinsic.eq(index)
  );
  const infoRecord = filtered.find(({ record: { event: { method, section } } }) =>
    section === 'system' &&
    ['ExtrinsicFailed', 'ExtrinsicSuccess'].includes(method)
  );
  const dispatchInfo = infoRecord
    ? infoRecord.record.event.method === 'ExtrinsicSuccess'
      ? infoRecord.record.event.data[0] as DispatchInfo
      : infoRecord.record.event.data[1] as DispatchInfo
    : undefined;

  return [
    dispatchInfo,
    filtered
  ];
}

function ExtrinsicDisplay ({ blockNumber, className = '', events, index, value }: Props): React.ReactElement<Props> {

  const { meta, method, section } = useMemo(
    () => value.registry.findMetaCall(value.callIndex),
    [value]
  );

  const mortality = useMemo(
    (): string | undefined => {
      if (value.isSigned) {
        const era = getEra(value, blockNumber);

        return era
          ? `mortal, valid from ${formatNumber(era[1])} to ${formatNumber(era[0])}`
          : `immortal`;
      }

      return undefined;
    },
    [blockNumber, value]
  );

  const [dispatchInfo, thisEvents] = useMemo(
    () => filterEvents(index, events),
    [index, events]
  );

  return (

    <Table.Row
      className={className}
      key={`extrinsic:${index}`}
    >
      <TableCell align='left'
        className='top'
      >
        <Expander
          summary={`${section}.${method}`}
          summaryMeta={meta}
        >
          <Call
            className='details'
            mortality={mortality}
            tip={value.tip?.toBn()}
            value={value}
            withHash
          />
        </Expander>
      </TableCell>

      <TableCell
        className='top media--1000'
      >
        {thisEvents
        ?.map(({ key, record }) =>
          <Event
            className='explorer--BlockByHash-event'
            key={key}
            value={record}
          />
        )}
      </TableCell>

      <TableCell className='top media--1200'>
        {value.isSigned && (
          <>
            <AddressMini value={value.signer} />
            <div className='explorer--BlockByHash-nonce'>
              {'index'} {formatNumber(value.nonce)}
            </div>
            <a
              href={`https://polkadot.polkastats.io/extrinsic/${value.hash.toHex()}`}
              type='extrinsic'
            />
          </>
        )}
      </TableCell>
    </Table.Row>
  );
}


export default React.memo(styled(ExtrinsicDisplay)`
  .explorer--BlockByHash-event+.explorer--BlockByHash-event {
    margin-top: 0.75rem;
  }

  .explorer--BlockByHash-nonce {
    font-size: 0.75rem;
    margin-left: 2.25rem;
    margin-top: -0.5rem;
    opacity: 0.6;
    text-align: left;
  }

  .explorer--BlockByHash-unsigned {
    opacity: 0.6;
    font-weight: var(--font-weight-normal);
  }
`);


/***
 * 
 *           <Table.Body>
            {pools.map((pool, i) => {
              const share = getPoolShare(pool);
              const [ratio1, ratio2] = getPoolRatio(pool);

              const closes = pool.status === 'provisioning'
                ? (expectedBlockTime * (pool as ProvisioningPool).notBefore) -
                (expectedBlockTime * currentBlock)
                : 0;

              return ();
            })}
          </Table.Body>
 */

/* 
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
*/