import React, { useState, useEffect, useReducer } from 'react'
import type { BlockHash, BlockNumber, Header } from '@polkadot/types/interfaces';
import BN from 'bn.js'
import { useApi } from '/react-environment/state/modules/api/hooks';
import { lastValueFrom } from 'rxjs';
import { useIsMountedRef } from './useIsMountedRef';
import { ApiRx } from '@polkadot/api';
import { useBlockHashRange } from '.';

interface Props { 
  from?: BlockNumber | BN;
  to?: BlockNumber | BN;
}

interface State {
  isLoading: boolean;
  isError: boolean;
  data: Map<string,number>
}

const hashRangeReducer = (state: State, action) => {
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

const genBlockHeaderPromises = (api: ApiRx, hashes: BlockHash[]): Promise<Header>[] => {
    return hashes.map(bn => lastValueFrom(api.rpc.chain.getHeader(bn)));
}

const transformHeaderResult = (headers: Header[], dispatch: React.Dispatch<any>) => {
    const dictBlockHashBlockNum = new Map<string, number>();
    for (const head of headers) {
        const hash = head.hash.toHex();
        const num = head.number.unwrap().toNumber();
        dictBlockHashBlockNum.set(hash, num);
    }
    dispatch({ type: 'FETCH_SUCCESS', payload: dictBlockHashBlockNum});
}

export default function useDictBlockNumberBlockHash(initialProps: Props): [State, React.Dispatch<React.SetStateAction<Props>>] {
  const api = useApi();
  const mountedRef = useIsMountedRef();
  
  const [ {data: hashRange, isLoading: isHashLoading, isError: isHashError}, setFromToParam ] = useBlockHashRange(initialProps);

  const [state, dispatch] = useReducer(hashRangeReducer, {
    isLoading: false,
    isError: false,
    data: new Map<string, number>()
  } as State);
  
  useEffect((): void => {

    const fetchData = () => {
      const promises = genBlockHeaderPromises(api, hashRange);
      dispatch({ type: 'FETCH_INIT' });
      
      Promise.all(promises)
        .then((headers): void => {
          mountedRef.current && transformHeaderResult(headers, dispatch);
        })
        .catch((error: Error): void => {
          dispatch({ type: 'FETCH_FAILURE' });
          console.error(error);
        });
    };
    
    if (mountedRef.current && hashRange?.length && !(isHashError || isHashLoading))
        fetchData();
  }, [api, mountedRef, hashRange, isHashLoading, isHashError]);

  return [state, setFromToParam];
}


