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
import { GenericEventData } from '@polkadot/types';
import { TypeDef } from '@polkadot/types/types';

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
  key: number | string;
  blockNumber: number;
  eventName: string;
  record: EventRecord;
}
interface EventArgs {
  key: number | string;
  type: string;
  data: string;
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
  return isLoading;
}
const byHashReducer = (state: State, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };

    case 'DICT_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
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

const CInnerExpander = (eventDataList: GenericEventData, types: TypeDef[]) => {
  const columns = [
    { title: "Type", dataIndex: "type" },
    { title: "Data", dataIndex: "data" }
  ];

  const rows: EventArgs[] = [];
  eventDataList.forEach((data, index) => {
    rows.push({
      key: index,
      type: types[index].type,
      data: data.toString()
    });
  });
  // return <Table columns={columns} dataSource={rows} pagination={false} />;
  return {rows, columns}
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

  // STATE DISPATCHER - FETCH DATA STATE
  useEffect(() => {
    const onQueryStateChange = () => {
      const queryError = isDictError || isEventsError,
        queryLoading = isDictLoading || isEventsLoading;
      if (queryError)
        dispatch({ type: 'FETCH_FAILURE', payload: 'Something bad happened...' });
      else if (queryLoading) {
        if (isEventsLoading || !dictBlockHashBlockNum.size)
          mutateLoadingMessage(queryLoading, setLoadingStatus) && dispatch({ type: 'FETCH_INIT' });
        else
          dispatch({ type: 'DICT_FETCH_SUCCESS' });
      }
      else
        dispatch({ type: 'ALL_FETCH_SUCCESS' });
    };
    mountedRef.current && onQueryStateChange();
  }, [mountedRef, isDictLoading, isEventsLoading, isDictError, isEventsError, 
      dictBlockHashBlockNum.size, setLoadingStatus]);

  // SET EVENTS QUERY BY HASH-RANGE --> useEventsByHashRange(range)
  useEffect(() => {
    if (isLoading || isError || !dictBlockHashBlockNum.size || eventsByHash.length) return;
    const queryEvents = () => {  
      setHashRangeProp({ hashRange: [...dictBlockHashBlockNum.keys()] });
    }
    mountedRef.current && queryEvents()
  }, [mountedRef, isLoading, isError,
       eventsByHash.length, dictBlockHashBlockNum, setHashRangeProp]);


  // use mapped blocks and events to generate the data for table.
  useEffect(() => {
    if (isError || isLoading || !eventsByHash.length) return;
    const mapEventsToTable = () => {
      const ExpanderFactory = (record: EventRecord) => {
        const event = record.event;
        const phase = record.phase;
        const types = event.typeDef;
        const { meta, method, section, data } = event

        const {rows, columns} = CInnerExpander(data, types);

        return event ? (
          <Expander
            summary={`${section}.${method}`}
            summaryMeta={meta}>
              <Table columns={columns} dataSource={rows} pagination={false} />
            </Expander>
          )
          : <></>;
      }
      
  
      const columns: ColumnsType<BlockEventDetails> = [
        { title: 'Block Number', dataIndex: 'blockNumber',
          sorter: (a, b) => a.blockNumber - b.blockNumber,
          sortDirections: ['descend'],
          width: 150
        },
        { title: 'Event Name', dataIndex: 'eventName',
          defaultSortOrder: 'descend',
          filters: [
            {
              text: 'System',
              value: 'system',
            },
            {
              text: 'Balances',
              value: 'balances',
            },
            {
              text: 'Staking',
              value: 'staking',
            },
            {
              text: 'Treasury',
              value: 'treasury',
            }
          ],
          onFilter: (value, record) => record.eventName.includes(value.toString()),
          sorter: (a, b) => a.eventName.localeCompare(b.eventName),
          width: 150
        },
        {
          title: 'Event Action',
          dataIndex: 'record',
          sorter: (a, b) => a.record.event.meta.docs.map((d) => d.toString().trim()).toString().length - b.record.event.meta.docs.map((d) => d.toString().trim()).toString().length,
          render: (row) => ExpanderFactory(row)
        },
      ];
  
      let prevBlockNum = 0, eventCountPerBlock = 0;
      const eRows: BlockEventDetails[] = [];
      for (let i = 0; i < eventsByHash.length; i++) {
        const { record, blockHash } = eventsByHash[i];
        const blockNumber = dictBlockHashBlockNum.get(blockHash ?? '')
        if (prevBlockNum !== blockNumber) {
          eventCountPerBlock = 1;
          prevBlockNum = blockNumber ?? 0;
        }
        eRows.push(
          {
            key: `${blockNumber} - ${eventCountPerBlock}`,
            blockNumber: blockNumber ?? 0,
            eventName: record.event.section.toString(),
            record: record
          });
        ++eventCountPerBlock;
      }
      dispatch({ type: 'TABLE_READY', payload: { rows: eRows, cols: columns } });
    }
    mapEventsToTable();
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
                : (<Table<BlockEventDetails> columns={cols} dataSource={rows} pagination={{ pageSize: 50, hideOnSinglePage: true, size: 'small', position: ['topRight'] }} />)
            }
          </Card.Content>
        </Card>
      </Col>
    </Row>
  );
}

export default React.memo(BlockByHash);
