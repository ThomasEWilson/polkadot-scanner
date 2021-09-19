// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '../types';
import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';
import type { Vec } from '@polkadot/types';
import type { HeaderExtended } from '@polkadot/api-derive/type/types';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { lastValueFrom } from 'rxjs';

import { AddressSmall } from '/ui-components/polkadot';
import { Card } from '/ui-components';
import { useApi } from '/react-environment/state/modules/api/hooks';
import { formatNumber } from '@polkadot/util';

import Extrinsics from './Extrinsics';
import Summary from './Summary';
import { useIsMountedRef } from '/lib';
import { Col, Row, Table } from 'antd';
import styled from 'styled-components';

interface Props {
  className?: string;
  error?: Error | null;
  value?: string | null;
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
  const [blockDetailData, setBlockDetailData] = useState<any[]>([]);
  const [blockDetailCols, setBlockDetailCols] = useState<any[]>([]);

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

  const blockNumber = getHeader?.number.unwrap();
  const parentHash = getHeader?.parentHash.toHex();
  const hasParent = !getHeader?.parentHash.isEmpty;

  useCallback(() => {
    // Loop Blocks, form detail Rows. Grabbing 1 row for now until
    // Format blockNumber here
    const data = [
      {
        key: 0,
        blocknumber: formatNumber(blockNumber) ?? '...',
        hash: getHeader?.hash.toHex() ?? '...',
        parent: parentHash ?? '...',
        extrinsics: getHeader?.extrinsicsRoot.toHex() ?? '...',
        state: getHeader?.stateRoot.toHex() ?? '...',
      }
    ];
    setBlockDetailData(data);

    const blockDetailCols = [
      { title: 'BlockNumber', dataIndex: 'blocknumber', key: 'blocknumber' },
      { title: 'Address', key: 'address', render: () => {
          getHeader 
            ? ( <AddressSmall value={getHeader?.author} /> )
            : ( <span> {'...'} </span> )
      }},
      { title: 'Hash', dataIndex: 'hash', key: 'hash' },
      { title: 'Parent', dataIndex: 'parent', key: 'parent' },
      { title: 'Extrinsics', dataIndex: 'extrinsics', key: 'extrinsics' },
      { title: 'State', dataIndex: 'state', key: 'state' },
    ];
    setBlockDetailCols(blockDetailCols)

    
  }, [getHeader, blockNumber, parentHash])


  // Going to use expandable row to show table of extrinsics for each block searched.
  // Definitely consider using the professional expander in antd.js
  // Definitely create these tables programattivally where possible with antd tables.

  return (
    <Row gutter={[24, 25]}>

      <Col span={24}>
        <Card variant='gradient-border'>
          <Card.Header>
            {'Summary'}
          </Card.Header>
          <Card.Content>
            <Summary
              events={events}
              maxBlockWeight={api.consts.system.blockWeights?.maxBlock}
              signedBlock={getBlock}
            />
          </Card.Content>
        </Card>
      </Col>

      <Col span={24}>
        <Card variant='gradient-border'>
          <Card.Header>
            {'Block(s) Details'}
          </Card.Header>
          <Card.Content>
            {/* <Table>
              <Table.Header>
                <Table.Row>
                  <TableHeaderCell align='left'>{formatNumber(blockNumber) ?? 0}</TableHeaderCell>
                  <TableHeaderCell>{'hash'}</TableHeaderCell>
                  <TableHeaderCell>{'parent'}</TableHeaderCell>
                  <TableHeaderCell>{'extrinsics'}</TableHeaderCell>
                  <TableHeaderCell>{'state'}</TableHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {myError
                  ? <Table.Row><Table.Cell colSpan={5}>{`Unable to retrieve the specified block details. ${myError.message}`}</Table.Cell></Table.Row>
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
                        >PolkaScan</a> 
                      </Table.Cell>
                    </Table.Row>
                  )
                }
              </Table.Body>
            </Table> */}
            {blockDetailCols && blockDetailData.length > 0 ? <CTable columns={blockDetailCols} dataSource={blockDetailData} pagination={false} />
                                                           : `Unable to retrieve the specified block details. ${myError?.message}`}
          </Card.Content>
        </Card>
      </Col>

      {getBlock && getHeader && (
        <Col span={24}>
          <Extrinsics
            blockNumber={blockNumber}
            events={events}
            value={getBlock.block.extrinsics}
          />
        </Col>
      )}
      
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

