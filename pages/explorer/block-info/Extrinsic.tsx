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

import Event from '../Event';

interface Props {
  blockNumber?: BlockNumber;
  className?: string;
  events?: KeyedEvent[];
  index: number;
  maxBlockWeight?: Weight;
  value: Extrinsic;
}

const BN_TEN_THOUSAND = new BN(10_000);

function getEra ({ era }: Extrinsic, blockNumber?: BlockNumber): [number, number] | null {
  if (blockNumber && era.isMortalEra) {
    const mortalEra = era.asMortalEra;

    return [mortalEra.birth(blockNumber.toBn().toNumber()), mortalEra.death(blockNumber.toBn().toNumber())];
  }

  return null;
}

function filterEvents (index: number, events: KeyedEvent[] = [], maxBlockWeight?: Weight): [DispatchInfo | undefined, number, KeyedEvent[]] {
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
    dispatchInfo && maxBlockWeight
      ? dispatchInfo.weight.toBn().mul(BN_TEN_THOUSAND).div(maxBlockWeight.toBn()).toNumber() / 100
      : 0,
    filtered
  ];
}

function ExtrinsicDisplay ({ blockNumber, className = '', events, index, maxBlockWeight, value }: Props): React.ReactElement<Props> {

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

  const [dispatchInfo, weightPercentage, thisEvents] = useMemo(
    () => filterEvents(index, events, maxBlockWeight),
    [index, events, maxBlockWeight]
  );

  return (
    <Table.Row
      className={className}
      key={`extrinsic:${index}`}
    >
      <Table.Cell
        className='top'
        colSpan={2}
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
      </Table.Cell>
      <Table.Cell
        className='top media--1000'
        colSpan={2}
      >
        {thisEvents.map(({ key, record }) =>
          <Event
            className='explorer--BlockByHash-event'
            key={key}
            value={record}
          />
        )}
      </Table.Cell>
      {/* <Table.Cell className='top number media--1400'>
        {dispatchInfo && (
          <>
            <>{formatNumber(dispatchInfo.weight)}</>
            <div>{weightPercentage.toFixed(2)}%</div>
          </>
        )}
      </Table.Cell> */}
      <Table.Cell className='top media--1200'>
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
      </Table.Cell>
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
