// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type HeaderExtended from '@polkadot/react-api/node_modules/@polkadot/api-derive/type/HeaderExtended';
import type { KeyedEvent } from '../types';
import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AddressSmall, Table } from '@polkadot/react-components';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import Extrinsics from './Extrinsics';
import LinkExternal from '/ui-components/LinkExternal';

interface Props {
  className?: string;
  error?: Error | null;
  value?: string | null;
}

const EMPTY_HEADER = [['...', 'start', 6]];

function transformResult([events, getBlock, getHeader]: [EventRecord[], SignedBlock, HeaderExtended?]): [KeyedEvent[], SignedBlock, HeaderExtended?] {
  return [
    events.map((record, index) => ({
      indexes: [index],
      key: `${Date.now()}-${index}-${record.hash.toHex()}`,
      record
    })),
    getBlock,
    getHeader
  ];
}

function BlockByHash({ className = '', error, value }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [[events, getBlock, getHeader], setState] = useState<[KeyedEvent[]?, SignedBlock?, HeaderExtended?]>([]);
  const [myError, setError] = useState<Error | null | undefined>(error);

  useEffect((): void => {
    value && Promise
      .all([
        api.query.system.events.at(value),
        api.rpc.chain.getBlock(value),
        api.derive.chain.getHeader(value)
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
      {/* <Summary
        events={events}
        maxBlockWeight={api.consts.system.blockExecutionWeight}
        signedBlock={getBlock}
      /> */}
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
                <td className='hash overflow'>{
                  hasParent
                    ? <Link to={`/explorer/query/${parentHash || ''}`}>{parentHash}</Link>
                    : parentHash
                }</td>
                <td className='hash overflow'>{getHeader.extrinsicsRoot.toHex()}</td>
                <td className='hash overflow'>{getHeader.stateRoot.toHex()}</td>
                <td className='media--1200'>
                  <LinkExternal
                    data={value}
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
