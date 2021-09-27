import React, { useState, useEffect, useReducer } from 'react'
import type { BlockHash, BlockNumber, EventRecord } from '@polkadot/types/interfaces';
import BN from 'bn.js'
import { useApi } from '/react-environment/state/modules/api/hooks';
import { lastValueFrom } from 'rxjs';
import { useIsMountedRef } from './useIsMountedRef';
import { ApiRx } from '@polkadot/api';
import { paramsNotation, Vec } from '@polkadot/types';
import { isNull, isUndefined } from 'lodash';

import type { Event } from '@polkadot/types/interfaces';
import { KeyedEvent } from '/pages/explorer/types';

interface Props { 
  hashRange?: string[]
}

interface State {
  isLoading: boolean;
  isError: boolean;
  data: KeyedEvent[]
}

const eventsFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const notNever = (params) => !isNull(params) && !isUndefined(params) && params.length > 1;

const genEventsPromises = (api: ApiRx, hashRange = [] as string[]): Promise<Vec<EventRecord>>[] | [] => {
  return hashRange.map(bn => lastValueFrom(api.query.system.events.at(bn)));
}

function transformRangeResults(blockRangeEvents: Vec<EventRecord>[]): KeyedEvent[] {
  if (isNull(blockRangeEvents) || isUndefined(blockRangeEvents) || !blockRangeEvents?.length)
      return [] as KeyedEvent[];

  const blockEventsByHash = blockRangeEvents.flatMap(
    (events, index: number) => {
      let hash = events.createdAtHash;
      return events.map((record, idx) => ({
        blockHash: hash,
        indexes: [idx],
        key: `${Date.now()}-${idx}-${record.hash.toHex()}`,
        record
      })) as KeyedEvent[]
    });
  return blockEventsByHash;
}

export default function useEventsByHashRange({ hashRange }: Props): [State, React.Dispatch<React.SetStateAction<Props>>] {
  const api = useApi();
  const mountedRef = useIsMountedRef();

  const [{hashRange: _hashRange}, setProps] = useState<Props>({hashRange});

  const [state, dispatch] = useReducer(eventsFetchReducer, {
    isLoading: false,
    isError: false,
    data: []
  });
  
  useEffect((): void => {

    const fetchData = () => {
      const promises = genEventsPromises(api, _hashRange);
      dispatch({ type: 'FETCH_INIT' });
      
      Promise.all(promises)
        .then((hashArray): void => {
          mountedRef.current && dispatch({ type: 'FETCH_SUCCESS', payload: transformRangeResults(hashArray)});
        })
        .catch((error: Error): void => {
          mountedRef.current && dispatch({ type: 'FETCH_FAILURE' });
          console.error(error);
        });
    };
    if (notNever(_hashRange))
      fetchData();

  }, [api, mountedRef, _hashRange]);

  return [state, setProps]
}

