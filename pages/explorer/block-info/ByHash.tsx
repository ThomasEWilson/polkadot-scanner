// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '../types';
import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';
import type { Vec } from '@polkadot/types';
import type { HeaderExtended } from '@polkadot/api-derive/type/types';

import React, { useEffect, useMemo, useState } from 'react';
import { forkJoin, switchMap } from 'rxjs';

import { AddressSmall, Table, LinkPolkascan } from '@polkadot/react-components';
import { useApi } from '/react-environment/state/modules/api/hooks';
import { formatNumber } from '@polkadot/util';

import Extrinsics from './Extrinsics';
import Summary from './Summary';

interface Props {
  className?: string;
  error?: Error | null;
  value?: string | null;
}

const EMPTY_HEADER = [['...', 'start', 6]];



function transformResult([events, getBlock, getHeader]: [Vec<EventRecord>, SignedBlock, HeaderExtended?]): [KeyedEvent[], SignedBlock, HeaderExtended?] {
  return [
    events.map(
      (record, index) => ({
        indexes: [index],
        key: `${Date.now()}-${index}-${record.hash.toHex()}`,
        record
      })),
    getBlock,
    getHeader
  ];
}

function BlockByHash({ className = '', error, value }: Props): React.ReactElement<Props> {
  const api = useApi();
  const [[events, getBlock, getHeader], setState] = useState<[KeyedEvent[]?, SignedBlock?, HeaderExtended?]>([]);
  const [myError, setError] = useState<Error | null | undefined>(error);

  useEffect((): void => {
    value && api.isReady
      .pipe(
        switchMap((api) =>
          forkJoin([
            api.query.system.events.at(value),
            api.rpc.chain.getBlock(value),
            api.derive.chain.getHeader(value)
          ])
        )
      )
      .subscribe({
        next: (result) => setState(transformResult(result)),
        error: (error) => setError(error),
        complete: () => console.log('Event: Switching Providers or Losing connection to Node')
      });
  }, [api, value]);

  const header = useMemo(
    () => getHeader
      ? [
        [formatNumber(getHeader.number.unwrap()), 'start', 1],
        [('hash'), 'start'],
        [('parent'), 'start'],
        [('extrinsics'), 'start'],
        [('state'), 'start'],
        [undefined, 'media--1200']
      ]
      : EMPTY_HEADER,
    [getHeader]
  );

  const blockNumber = getHeader?.number.unwrap();
  const parentHash = getHeader?.parentHash.toHex();
  const hasParent = !getHeader?.parentHash.isEmpty;

  return (
    <div className={className}>
      <Summary
        events={events}
        maxBlockWeight={api.consts.system.blockWeights.maxBlock}
        signedBlock={getBlock}
      />
      <Table
      >
        <Table.Head>
          {header}
        </Table.Head>
        <Table.Body>
          {myError
            ? <tr><td colSpan={6}>{`Unable to retrieve the specified block details. ${myError.message}`}</td></tr>
            : getBlock && getHeader && !getBlock.isEmpty && !getHeader.isEmpty && (
              <tr>
                <td className='address'>
                  {getHeader.author && (
                    <AddressSmall value={getHeader.author} />
                  )}
                </td>
                <td className='hash overflow'>{getHeader.hash.toHex()}</td>
                <td className='hash overflow'>{parentHash}</td>
                <td className='hash overflow'>{getHeader.extrinsicsRoot.toHex()}</td>
                <td className='hash overflow'>{getHeader.stateRoot.toHex()}</td>
                <td className='media--1200'>
                  <LinkPolkascan
                    data={value ?? '#'}
                    type='block'
                  />
                </td>
              </tr>
            )
          }
        </Table.Body>

      </Table>
      {getBlock && getHeader && (
        <Extrinsics
          blockNumber={blockNumber}
          events={events}
          value={getBlock.block.extrinsics}
        />
      )}
    </div>
  );
}

export default React.memo(BlockByHash);
