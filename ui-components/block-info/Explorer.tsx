import React, { useEffect, useRef, useState, FC, useCallback, useMemo } from 'react';
import BN from 'bn.js';
import styled from 'styled-components'

import {default as BlocksByNumberRange} from '/ui-components/block-info/ByHash';
import { useIdleTimer } from 'react-idle-timer'
import { useDataChanger, useBestNumber, useNumberRule, useRPCRule, useIsMountedRef } from '/lib';
import { useSetTitle } from '/react-environment/state/modules/application/hooks';
import { Button, Card, FlexBox, Form, FormItem, Input } from '/ui-components'
import { flexBox, typography } from '/ui-components/utils'
import { isEmpty, isNumber, toNumber } from 'lodash';
import { BlockNumber } from '@polkadot/types/interfaces';
import { apiResolver } from 'next/dist/server/api-utils';
import { useApi, useEndpoints, useSetEndpoints, useSetFirstEndpoint } from '/react-environment/state/modules/api/hooks';
import { firstValueFrom } from 'rxjs';
import { setFirstEndpoint } from '/react-environment/state/modules/api/actions';


const CForm = styled(Form)`
  margin-top: 60px;

  & .ant-form-item {
    margin-bottom: 0;
  }
`;

const SearchBtn = styled(Button)`  
  margin: 32px auto 0 auto;
  padding: 0 40px;
  width: 320px;`

const ErrorBtn = styled(SearchBtn).attrs({ as: Button })``;

const CCard = styled(Card)`
  margin: 36px auto;
  width: 560px;
  padding: 36px 24px;
  background: linear-gradient(101.18deg, rgba(255, 255, 255, 0) 1.64%, rgba(255, 255, 255, 0.1) 112.71%) no-repeat border-box padding-box, linear-gradient(rgb(34, 34, 34), rgb(34, 34, 34)) padding-box, linear-gradient(50.94deg, rgba(228, 12, 91, 0) 48.71%, rgba(255, 76, 59, 0.6) 94.76%) border-box rgb(34, 34, 34);`;

const CFormItem = styled(FormItem)`
    margin: 0.5rem 0;`

const CPrefix = styled.span`
  font-weight: 500
`
interface FormData { 
  rpcUrl: string; 
  fromBlockNumber: number;
  toBlockNumber?: number;
}

interface BlockNumberProps {
  from: BlockNumber | BN;
  to: BlockNumber | BN;
}

const POLKAENDPOINT = 'wss://rpc.polkadot.io';

const ExplorerPage: FC = () => {
  const setTitleRef = useRef<(title: string) => void>(useSetTitle());
  const setFirstEndpointRef = useRef<(firstEndpoint: Record<string, string>) => void>(useSetFirstEndpoint());
  const isDefaultSet = useRef<boolean>(false);

  useEffect(() => {
    const updateTitle = () => {
      setTitleRef.current('Polkadot Block-Range Explorer');
    }
    if (isDefaultSet.current == false) {
      updateTitle();
    }
  }, [setTitleRef, isDefaultSet]);

  const api = useApi()
  const endpoints = useEndpoints()
  const setEndpoints = useSetEndpoints();
  const currentBestNumber = useBestNumber();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSearching, setSearching] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<BlockNumberProps | null>(null);
  
  const mountedRef = useIsMountedRef();
  const idleRef = useRef<boolean>(true);
  

  
  const [form] = Form.useForm<FormData>();
  const initFormData: FormData = useMemo(() => {
    return {
      rpcUrl: 'wss://rpc.polkadot.io',
      fromBlockNumber: 6829987,
      toBlockNumber: 6829988 
    }
  }, []);

  const { data, dataRef, update } = useDataChanger<FormData>(initFormData);
  const requiredFlag = useRef<boolean>(true);

  const fromBlockRules = useNumberRule({
    required: () => requiredFlag.current,
    requiredMessage: `Blocknumber required (+int <= toBlockNumber)`,
    min: 0,
    minMessage: 'Must be greater than zero',
    max: dataRef?.current?.toBlockNumber ?? currentBestNumber?.toNumber() ?? 6829988,
    maxMessage: 'Must be less than (<) BlockNumber (TO) - 1'
  });
  const toBlockRules = useNumberRule({
    required: () => requiredFlag.current,
    requiredMessage: `Blocknumber required (+int >= fromBlockNumber)`,
    min: toNumber(dataRef?.current?.fromBlockNumber) ?? 0,
    minMessage: 'Must be greater than fromBlockNumber',
    max: currentBestNumber?.toNumber() ?? 6829988,
    maxMessage: 'Must be lessthan or equal (<=) current Block Number'
  });

  const rpcRules = useRPCRule({});

  const setRPCValue = useCallback((rpcVal?: string) => {
    const _data = { rpcUrl: dataRef.current.rpcUrl };

    _data.rpcUrl = rpcVal?.toString() || '';

    update(_data);
    form.setFieldsValue(_data);
  }, [dataRef, form, update]);

  const setFromBlockValue = useCallback((num?: number) => {
    const _data = { fromBlockNumber: dataRef.current.fromBlockNumber };

    _data.fromBlockNumber = toNumber(num) || 0;

    update(_data);
    form.setFieldsValue(_data);
  }, [dataRef, form, update]);

  const setToBlockValue = useCallback((num?: number) => {
    const _data = { toBlockNumber: dataRef.current.toBlockNumber };

    _data.toBlockNumber = toNumber(num) || 0;

    update(_data);
    form.setFieldsValue(_data);
  }, [dataRef, form, update]);

  const handleValueChange = useCallback((changed: Partial<FormData>) => {
    if (changed.rpcUrl) {
        setRPCValue(changed.rpcUrl);
    }
    if (changed.fromBlockNumber) {
        setFromBlockValue(changed.fromBlockNumber);
    }
    if (changed.toBlockNumber) {
        setToBlockValue(changed.toBlockNumber);
    }
    // update(changed);
  }, [setRPCValue, setFromBlockValue, setToBlockValue]);

  const handlePreCheck = useCallback(async () => {
    try {
      await form.validateFields();
    } catch (e) {
      return () => {
        setErrorMessage('Whoops: Validation Error. Try a different input, reset the app, or use defaults by going idle.');
        return false;
      };
    }
    return true;
  }, [form]);

  //   Action on search
  const search = useCallback(async () => {
      if (await handlePreCheck()
            && isNumber(dataRef.current.fromBlockNumber) && isNumber(dataRef.current.toBlockNumber)) {
        if (POLKAENDPOINT !== dataRef.current.rpcUrl) {
            api.disconnect();
            setFirstEndpointRef.current({'url': dataRef.current.rpcUrl});
        }
        setErrorMessage(``);
        setSearching(true);
        const from = new BN(dataRef.current.fromBlockNumber) as BlockNumber;
        const to = new BN(dataRef.current.toBlockNumber) as BlockNumber;
        setSearchParams({from, to} as BlockNumberProps);
        isDefaultSet.current = false;
      } else
          setErrorMessage(`Search struggles.. - kindly \nuse positive integers or simply go idle for defaults.`);
  }, [dataRef, handlePreCheck, isDefaultSet, setFirstEndpointRef]);

  
  const resetQueryState = () => {
    setSearchParams(null);
    setSearching(false);
    setErrorMessage(``);
  }
  
  const { isIdle, start: idleTimerStart, pause: idleTimerPause } = useIdleTimer({
    timeout: 1000 * 8
  })
  useEffect(() => {
    idleRef.current = isIdle();
  });

  const onFocusFields = useCallback(() => {
      idleTimerStart();
      idleTimerPause();
  }, [idleTimerStart, idleTimerPause])

  const onBlurFields = useCallback(() => {
      idleTimerStart();
  }, [idleTimerStart])
  

  // Initialize Inputs with API Values
  const setDefaultsFromAPI = useCallback(async (num?: number) => {
      if (!num) {
        const _bestNumber = await firstValueFrom(api.derive.chain.bestNumberFinalized());
        num = _bestNumber.toNumber();
      }
      const _data = {
        fromBlockNumber: num - 1,
        toBlockNumber: num
      };

      initFormData.toBlockNumber = num;
      initFormData.fromBlockNumber = num - 1;

      update(_data);
      form.setFieldsValue(_data);
      return Promise.resolve();

    }, [api, update, form, initFormData]);

  useEffect(() => {
    if (idleRef.current && !isSearching) {
      setDefaultsFromAPI(currentBestNumber?.toNumber());
    }
    else if (isDefaultSet.current == false && !isSearching) {
      setDefaultsFromAPI(currentBestNumber?.toNumber());
      isDefaultSet.current = true;
    }
  }, [idleRef, update, form, api,
     setDefaultsFromAPI, currentBestNumber, isSearching]);

  return (
    <>
    <CForm
      form={form}
      onValuesChange={handleValueChange}
    >
      <CCard variant='gradient-border'>
        <CFormItem
          initialValue={initFormData.rpcUrl}
          name='rpcUrl'
          rules={rpcRules}
        >
          <Input 
            prefix={(<CPrefix>RPC URL:</CPrefix>)}
            onFocus={onFocusFields}
            onBlur={onBlurFields}
          />
        </CFormItem>

        <CFormItem
          initialValue={initFormData.fromBlockNumber}
          name='fromBlockNumber'
          rules={fromBlockRules}
        >
          <Input 
            prefix={(<CPrefix>Blocknumber (FROM):</CPrefix>)}
            onFocus={onFocusFields}
            onBlur={onBlurFields}
          />
        </CFormItem>

        <CFormItem
          initialValue={initFormData.toBlockNumber}
          name='toBlockNumber'
          rules={toBlockRules}
        >
          <Input 
            prefix={(<CPrefix>Blocknumber (TO):</CPrefix>)}
            onFocus={onFocusFields}
            onBlur={onBlurFields}
          />
        </CFormItem>
        {!isEmpty(errorMessage) && ( 
              <ErrorBtn
                disabled
              >
                {errorMessage}
              </ErrorBtn>
        )}
        <SearchBtn
          onClick={() => search()}
        >
          {'Search'}
          
        </SearchBtn>
      </CCard>
    </CForm>
        { isSearching && searchParams &&
            <BlocksByNumberRange
              // error={error}
              searchProps={searchParams}
          />
        }
    </>
  )
}

export default ExplorerPage;