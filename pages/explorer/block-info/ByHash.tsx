// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '../types';
import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';
import type { Vec } from '@polkadot/types';
import type { HeaderExtended } from '@polkadot/api-derive/type/types';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { lastValueFrom } from 'rxjs';

import { AddressSmall } from '/ui-components/polkadot';
import { Table } from '/ui-components';
import { useApi } from '/react-environment/state/modules/api/hooks';
import { formatNumber } from '@polkadot/util';

import Extrinsics from './Extrinsics';
import Summary from './Summary';
import { useIsMountedRef } from '/lib';

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

  const mountedRef = useIsMountedRef();
  const [[events, getBlock, getHeader], setState] = useState<[KeyedEvent[]?, SignedBlock?, HeaderExtended?]>([]);
  const [myError, setError] = useState<Error | null | undefined>(error);

  useEffect((): void => {
    value && Promise
      .all([
        lastValueFrom(api.query.system.events.at(value)),
        lastValueFrom(api.rpc.chain.getBlock(value)),
        lastValueFrom(api.derive.chain.getHeader(value))
      ])
      .then((result): void => {
        mountedRef.current && setState(transformResult(result));
      })
      .catch((error: Error): void => {
        mountedRef.current && setError(error);
      });
  }, [api, mountedRef, value]);

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
        <Table.Header>
          {header}
        </Table.Header>
        <Table.Body>
          {myError
            ? <Table.Row><Table.Cell colSpan={6}>{`Unable to retrieve the specified block details. ${myError.message}`}</Table.Cell></Table.Row>
            : getBlock && getHeader && !getBlock.isEmpty && !getHeader.isEmpty && (
              <Table.Row>
                <Table.Cell className='address'>
                  {getHeader.author && (
                    <AddressSmall value={getHeader.author} />
                  )}
                </Table.Cell>
                <Table.Cell className='hash overflow'>{getHeader.hash.toHex()}</Table.Cell>
                <Table.Cell className='hash overflow'>{parentHash}</Table.Cell>
                <Table.Cell className='hash overflow'>{getHeader.extrinsicsRoot.toHex()}</Table.Cell>
                <Table.Cell className='hash overflow'>{getHeader.stateRoot.toHex()}</Table.Cell>
                <Table.Cell className='media--1200'>
                  <a
                    href={value ?? '#'}
                  > PolkaScan Block-Link</a> 
                </Table.Cell>
              </Table.Row>
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
