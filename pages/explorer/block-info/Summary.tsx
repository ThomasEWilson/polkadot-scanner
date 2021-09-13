// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '../types';
import type { DispatchInfo, SignedBlock, Weight } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '/react-environment/state/modules/api/hooks';

import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';


interface Props {
  events?: KeyedEvent[];
  maxBlockWeight?: Weight;
  signedBlock?: SignedBlock;
}

function extractEventDetails (events?: KeyedEvent[]): [BN?, BN?, BN?] {
  return events
    ? events.reduce(([deposits, transfers, weight], { record: { event: { data, method, section } } }) => [
      section === 'balances' && method === 'Deposit'
        ? deposits.iadd(data[1] as any)
        : deposits,
      section === 'balances' && method === 'Transfer'
        ? transfers.iadd(data[2] as any)
        : transfers,
      section === 'system' && ['ExtrinsicFailed', 'ExtrinsicSuccess'].includes(method)
        ? weight.iadd(((method === 'ExtrinsicSuccess' ? data[0] : data[1]) as DispatchInfo).weight.toBn())
        : weight
    ], [new BN(0), new BN(0), new BN(0)])
    : [];
}

function Summary ({ events, maxBlockWeight, signedBlock }: Props): React.ReactElement<Props> | null {
  const api = useApi();

  const [deposits, transfers, weight] = useMemo(
    () => extractEventDetails(events),
    [events]
  );

  if (!events || !signedBlock) {
    return null;
  }

  return (
    <SummaryBox>
      <section>
        {api.query.balances && (
          <>
            <CardSummary label={'deposits'}>
              <FormatBalance value={deposits} />
            </CardSummary>
            <CardSummary label={'transfers'}>
              <FormatBalance value={transfers} />
            </CardSummary>
          </>
        )}
      </section>
      {maxBlockWeight && (
        <section>
          <CardSummary
            label={'block weight'}
            progress={{
              hideValue: true,
              total: maxBlockWeight,
              value: weight
            }}
          >
            {formatNumber(weight)}
          </CardSummary>
        </section>
      )}
      <section>
        <CardSummary label={'event count'}>
          {formatNumber(events.length)}
        </CardSummary>
        <CardSummary label={'extrinsic count'}>
          {formatNumber(signedBlock.block.extrinsics.length)}
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
