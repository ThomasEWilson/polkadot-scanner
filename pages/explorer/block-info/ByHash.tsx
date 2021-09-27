// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useReducer } from 'react';
import BN from 'bn.js';
import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import type { EventRecord, BlockNumber } from '@polkadot/types/interfaces';

import styled from 'styled-components';
import { Expander } from '/ui-components/polkadot';
import { Button, Card } from '/ui-components';
import { CardLoading } from '/ui-components/loading/CardLoading';

import { useIsMountedRef, useEventsByHashRange, useDictBlockNumberBlockHash } from '/lib';

import { useApi } from '/react-environment/state/modules/api/hooks';
import { useSetLoadingStatus } from '/react-environment/state/modules/application/hooks';

interface BlockNumberProps {
  from: BlockNumber | BN;
  to: BlockNumber | BN;
}
interface Props {
  className?: string;
  error?: Error | null;
  searchProps: BlockNumberProps;
}

interface BlockEventDetails {
  key?: number | string;
  blocknumber?: number;
  eventName?: string;
  record?: EventRecord;
}

const ErrorBtn = styled(Button).attrs({ as: Button })`
  margin: 32px auto 0 auto;
  padding: 0 40px;
  width: 320px;
  opacity: 0.7;
`;

interface State {
  isLoading: boolean;
  isError: boolean;
  error: string;
  tableData: {
    rows: BlockEventDetails[];
    cols: ColumnsType<BlockEventDetails>;
  }
}

const mutateLoadingMessage = (isLoading, dispatch) => {
  dispatch(isLoading ? `Grabbing Blocks & their Events by Hash Range` : ``);
}
const byHashReducer = (state: State, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'ALL_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false
      };
    case 'TABLE_READY':
      return {
        ...state,
        tableData: action.payload
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload
      };
    default:
      throw new Error();
  }
};

function BlockByHash({ className = '', searchProps: { from, to } }: Props): React.ReactElement<Props> {
  const api = useApi();

  const mountedRef = useIsMountedRef();
  const setLoadingStatus = useSetLoadingStatus();

  const [{ data: dictBlockHashBlockNum, isLoading: isDictLoading, isError: isDictError }, setFromToProp] = useDictBlockNumberBlockHash({ from, to });
  const [{ data: eventsByHash, isLoading: isEventsLoading, isError: isEventsError }, setHashRangeProp] = useEventsByHashRange({});

  const [{ isLoading, isError, error, tableData: { rows, cols } }, dispatch] = useReducer(byHashReducer, {
    isLoading: isDictLoading || isEventsLoading,
    isError: isDictError || isEventsError,
    error: ``,
    tableData: { rows: [], cols: [] }
  });

  // DISPATCH FETCH DATA STATE
  useEffect(() => {
    const onQueryStatusChange = () => {
      const queryError = isDictError || isEventsError,
        queryLoading = isDictLoading || isEventsLoading;
      if (queryError)
        dispatch({ type: 'FETCH_FAILURE', payload: 'Something bad happened...' });
      else if (queryLoading)
        dispatch({ type: 'FETCH_INIT' })
      //isDictLoading --> false, isEventsLoading -- not started.
      else if (!eventsByHash.length && dictBlockHashBlockNum.size)
        setHashRangeProp({ hashRange: [...dictBlockHashBlockNum.keys()] });
      else
        dispatch({ type: 'ALL_FETCH_SUCCESS' });
    };
    mountedRef.current && onQueryStatusChange();
  }, [mountedRef, isDictLoading, isEventsLoading, isDictError, isEventsError,
    eventsByHash.length, dictBlockHashBlockNum, setHashRangeProp]);

  // SET LOADING MSG
  useEffect(() => {
    mountedRef.current && mutateLoadingMessage(isLoading, setLoadingStatus);
  }, [mountedRef, isLoading, setLoadingStatus]);


  // use mapped blocks and events to generate the data for table.
  useEffect(() => {
    if (isError || isLoading || !eventsByHash.length) return;

    const ExpanderFactory = (event) => {
      const { meta, method, section } = event
      return event ? <Expander
        summary={`${section}.${method}`}
        summaryMeta={meta.documentation.toString()}></Expander>
        : <></>;
    }

    const columns: ColumnsType<BlockEventDetails> = [
      { title: 'Block Number', dataIndex: 'blocknumber' },
      { title: 'Event Name', dataIndex: 'eventName' },
      {
        title: 'Event Action',
        dataIndex: 'event-section-method-meta-row',
        render: ({ event }) => ExpanderFactory(event)
      },
    ];

    let prevBlockNum = 0, blockCount = 0;
    const eRows: BlockEventDetails[] = [];
    for (let j = 0; j < eventsByHash.length; j++) {
      const { record, blockHash } = eventsByHash[j];
      const blockNumber = dictBlockHashBlockNum.get(blockHash ?? '')
      blockCount = (prevBlockNum !== blockNumber) ? 1 : ++blockCount;
      eRows.push(
        {
          key: `${blockNumber}-${blockCount}`,
          blocknumber: blockNumber,
          eventName: record.event.section.toString(),
          record: record
        });
    }
    dispatch({ type: 'TABLE_READY', payload: { rows: eRows, cols: columns } });
  }, [isLoading, isError, eventsByHash, dictBlockHashBlockNum]);

  return (
    <Row gutter={[24, 25]}>
      <Col span={24}>
        <Card className={className} variant='gradient-border'>
          <Card.Header>
            {'Block(s) Details'}
          </Card.Header>
          <Card.Content>
            {isError
              ? (<ErrorBtn disabled>
                {error}
              </ErrorBtn>)
              : isLoading || !rows || !cols
                ? (<CardLoading />)
                : (<Table<BlockEventDetails> columns={cols} dataSource={rows} pagination={false} />)
            }
          </Card.Content>
        </Card>
      </Col>
    </Row>
  );
}

export default React.memo(BlockByHash);

