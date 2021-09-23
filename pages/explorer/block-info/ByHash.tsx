// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '../types';
import type { EventRecord, SignedBlock, Hash, BlockNumber } from '@polkadot/types/interfaces';
import type { Vec } from '@polkadot/types';
import type { HeaderExtended } from '@polkadot/api-derive/type/types';

import React, { useEffect, useState, useRef } from 'react';
import { lastValueFrom, Observable } from 'rxjs';

import { AddressSmall } from '/ui-components/polkadot';
import { Card } from '/ui-components';
import { useApi } from '/react-environment/state/modules/api/hooks';
import { formatNumber } from '@polkadot/util';

import Extrinsics from './Extrinsics';
import Summary from './Summary';
import { useBlockHashRange, useIsMountedRef } from '/lib';
import { Col, Row, Table } from 'antd';
import styled from 'styled-components';
import { CardLoading } from '/ui-components/loading/CardLoading';

interface Props {
  className?: string;
  error?: Error | null;
  from?: string | Hash | null;
  to?: string | Hash | null;
}

interface BlockDetailsData {
  key: number;
  blocknumber: string;
  hash: string;
  parent: string;
  extrinsics: string;
  state: string;
}
interface BlockDetailsCols {
  title: string;
  dataIndex: string;
  key: string;
  render?: any;
}

// const EMPTY_HEADER = [['...', 'start', 6]];

// const TableHeaderCell = styled(Table.Cell)`
//   text-transform: uppercase;
// `;
// const TableCell = styled(Table.Cell)`
//   white-space: pre-wrap;
//   word-wrap: break-word;
// `;

const CTable = styled(Table)``


// function transformResult([events, getBlock, getHeader]: [Vec<EventRecord>, SignedBlock, HeaderExtended?]): [ KeyedEvent[], SignedBlock, HeaderExtended?] {
//   return [
//     events.map(
//       (record, index) => ({
//         indexes: [index],
//         key: `${Date.now()}-${index}-${record.hash.toHex()}`,
//         record
//       })),
//     getBlock,
//     getHeader
//   ];
// }

interface BlockEventsByHash {
  hash: Hash,
  events: KeyedEvent[]
  signedBlock?: SignedBlock
}

function transformRangeResults(mapBlockEventsByHash: [Hash, Vec<EventRecord>][]): BlockEventsByHash[] {
  const blockEventsByHash = mapBlockEventsByHash.map(
    ([hash, events], index: number) => ({
      hash: hash,
      events: events.map((record, idx) => ({
        blockHash: hash.toString(),
        indexes: [idx],
        key: `${Date.now()}-${idx}-${record.hash.toHex()}`,
        record
      })) as KeyedEvent[]
    }));

  return blockEventsByHash;
}

function BlockByHash({ className = '', error, from, to }: Props): React.ReactElement<Props> {
  const api = useApi();

  const blockHashRange = useBlockHashRange(from, to);
  const mountedRef = useIsMountedRef();
  const [blockEventsByHash, setBlockEventsByHash] = useState<BlockEventsByHash[] | null>([]);
  const [blocks, setBlocks] = useState<SignedBlock[]>();
  const [myError, setError] = useState<Error | null | undefined>(error);
  // Setting up mad awesome table here.
  const [blockDetailData, setBlockDetailData] = useState<any[]>([]);
  const [blockDetailCols, setBlockDetailCols] = useState<any[]>([]);

  useEffect((): void => {
    from && to && Promise
      .all([
        lastValueFrom(api.query.system.events.range([from, to]))
      ])
      .then(([result]): void => {
        mountedRef.current && setBlockEventsByHash(transformRangeResults(result));
      })
      .catch((error: Error): void => {
        mountedRef.current && setError(error);
      });
  }, [api, mountedRef, from, to]);

  // Grab blocks after we get BlockHashRange
  useEffect((): void => {
    let calls = [] as Promise<SignedBlock>[];
    if (blockHashRange) {
      for (const hash of blockHashRange) {
        calls.push(
          lastValueFrom(api.rpc.chain.getBlock(hash)));
      }
    }
    (calls?.length > 0) && Promise
      .all([...calls])
      .then((result): void => {
        mountedRef.current && setBlocks(result);
      })
      .catch((error: Error): void => {
        mountedRef.current && setError(error);
      });
  }, [api, mountedRef, blockHashRange]);

  useEffect(() => {

    // SO YOU have BLOCKS and EVENTS on the range, eh? Well time to map them to Cols and Data 
    const data = [
      {
        key: 0,
      }
    ];
    setBlockDetailData(data);

    const blockDetailCols = [
      { title: 'BlockNumber', dataIndex: 'blocknumber', key: 'blocknumber' },
      // { title: 'Address', key: 'address', render: () => {
      //     getHeader 
      //       ? ( <AddressSmall value={getHeader?.author} /> )
      //       : ( <span> {'...'} </span> )
      // }},
      { title: 'Hash', dataIndex: 'hash', key: 'hash' },
      { title: 'Parent', dataIndex: 'parent', key: 'parent' },
      { title: 'Extrinsics', dataIndex: 'extrinsics', key: 'extrinsics' },
      { title: 'State', dataIndex: 'state', key: 'state' },
    ];
    setBlockDetailCols(blockDetailCols)


  }, [blockEventsByHash, blocks])


  // Going to use expandable row to show table of extrinsics for each block searched.
  // Definitely consider using the professional expander in antd.js
  // Definitely create these tables programattivally where possible with antd tables.

  return (
    <Row gutter={[24, 25]}>

      <Col span={24}>
        <Card variant='gradient-border'>
          <Card.Header>
            {'Block(s) Details'}
          </Card.Header>
          <Card.Content>
            {false && blockDetailCols && blockDetailData.length ? <CTable columns={blockDetailCols} dataSource={blockDetailData} pagination={false} />
              : <CardLoading />}
          </Card.Content>
        </Card>
      </Col>

      {/* {getBlock && getHeader && (
        <Col span={24}>
          <Extrinsics
            blockNumber={blockNumber}
            events={events}
            value={getBlock.block.extrinsics}
          />
        </Col>
      )} */}

    </Row>
  );
}

export default React.memo(BlockByHash);


/*

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
       */

/*

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
*/

