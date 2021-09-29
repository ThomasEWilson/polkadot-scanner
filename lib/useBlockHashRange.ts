import React, { useState, useEffect, useReducer } from 'react'
import type { BlockHash, BlockNumber } from '@polkadot/types/interfaces';
import BN from 'bn.js'
import { useApi } from '/react-environment/state/modules/api/hooks';
import { lastValueFrom } from 'rxjs';
import { useIsMountedRef } from './useIsMountedRef';
import { ApiRx } from '@polkadot/api';

interface Props { 
  from?: BlockNumber | BN;
  to?: BlockNumber | BN;
}

interface State {
  isLoading: boolean;
  isError: boolean;
  data: BlockHash[]
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

const genBlockHashPromises = (api: ApiRx, props: Props): Promise<BlockHash>[] | [] => {
  if (!(props?.to && props?.from))
    return [];
  const { to, from } = props;
  if (to.sub(from).eqn(1)) {
    return [ lastValueFrom(api.rpc.chain.getBlockHash(from)),
             lastValueFrom(api.rpc.chain.getBlockHash(to))];
  } else {
    const blockNumList: BN[] = []
    for (let i = from.toNumber(); i <= to.toNumber(); i++) {
      const bn = new BN(i);
      blockNumList.push(bn);
    }
    return blockNumList.map(bn => lastValueFrom(api.rpc.chain.getBlockHash(bn)));
  }
}

export default function useBlockHashRange(initialProps: Props): [State, React.Dispatch<React.SetStateAction<Props>>] {
  const api = useApi();
  const mountedRef = useIsMountedRef();

  const [_props, setProps] = useState<Props>(initialProps);

  const [state, dispatch] = useReducer(hashRangeReducer, {
    isLoading: false,
    isError: false,
    data: []
  } as State);
  
  useEffect((): void => {

    const fetchData = () => {
      const promises = genBlockHashPromises(api, _props);
      dispatch({ type: 'FETCH_INIT' });
      
      Promise.all(promises)
        .then((hashArray): void => {
          mountedRef.current && dispatch({ type: 'FETCH_SUCCESS', payload: hashArray});
        })
        .catch((error: Error): void => {
          dispatch({ type: 'FETCH_FAILURE' });
          console.error(error);
        });
    };
    if (mountedRef.current && _props?.to && _props?.from)
      fetchData();
  }, [api, mountedRef, _props]);

  return [state, setProps];
}


