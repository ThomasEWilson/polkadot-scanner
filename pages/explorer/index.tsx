

import React, { useEffect, useRef, useState, FC, useCallback, useMemo } from 'react';
import type { NextPage } from 'next'
import BN from 'bn.js';
import styled from 'styled-components'
import { useIdleTimer } from 'react-idle-timer'

import { useDataChanger, useBestNumber, useNumberRule, useRPCRule, useIsMountedRef, withSession } from '/lib';
import { useSetTitle } from '/react-environment/state/modules/application/hooks';
import { Button, Card, Form, FormItem, Input, BlocksByNumberRange } from '/ui-components'
import { isEmpty, isNumber, toNumber } from 'lodash';
import { BlockNumber } from '@polkadot/types/interfaces';
import { useApi, useSetFirstEndpoint } from '/react-environment/state/modules/api/hooks';
import { firstValueFrom } from 'rxjs';


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
interface ServerProps {
  user: {
    isLoggedIn: boolean;
  };
}
const POLKAENDPOINT = 'wss://rpc.polkadot.io';

// Commented out server-sider-rendering for deployment, not getting the page to load, going with static side rendering.
// export const getServerSideProps = withSession(async function (props: any) {
//   // Get the user's session based on the request
//   const user = props.req.session.get('user');

//   if (!user) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: { user },
//   }
// })

const Explorer: NextPage = () => {   
  
  const api = useApi()
  const currentBestNumber = useBestNumber();

  const idleRef = useRef<boolean>(true);
  const requiredFlag = useRef<boolean>(true);
  const setTitleRef = useRef<(title: string) => void>(useSetTitle());
  const setFirstEndpointRef = useRef<(firstEndpoint: Record<string, string>) => void>(useSetFirstEndpoint());
  const isDefaultSet = useRef<boolean>(false);
  
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSearching, setSearching] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<BlockNumberProps | null>(null);
  
  const [form] = Form.useForm<FormData>();
  const initFormData: FormData = useMemo(() => {
    return {
      rpcUrl: POLKAENDPOINT,
      fromBlockNumber: 1,
      toBlockNumber: 7000000 
    }
  }, []);
  const { data, dataRef, update } = useDataChanger<FormData>(initFormData);

  useEffect(() => {
    const updateTitle = () => setTitleRef.current('Polkadot Block-Range Explorer');
    (isDefaultSet.current == false) && updateTitle();
  }, [setTitleRef, isDefaultSet]);


  const getRuleByType = useCallback((type: string): number => {
    switch (type) {
      case "from-min":
        return (dataRef?.current?.toBlockNumber) ? toNumber(dataRef?.current?.toBlockNumber) - 50 : 0;
      case "from-max":
        return (dataRef?.current?.toBlockNumber) 
                ? toNumber(dataRef?.current?.toBlockNumber) - 1
                : (currentBestNumber?.toNumber())
                  ? currentBestNumber?.toNumber() - 1
                  : 7000000; 
      case "to-min":
        return (dataRef?.current?.fromBlockNumber) ? toNumber(dataRef?.current?.fromBlockNumber) + 1 : 0;
      case "to-max":
        return (dataRef?.current?.fromBlockNumber) 
                ? toNumber(dataRef?.current?.fromBlockNumber) + 50 
                : (currentBestNumber?.toNumber())
                  ? currentBestNumber?.toNumber() 
                  : 7000001; 
      default:
        return 0;
    }
  }, [dataRef, currentBestNumber]);

  const fromBlockRules = useNumberRule({
    required: () => requiredFlag.current,
    requiredMessage: `Blocknumber required (1 < +int-START < END)`,
    min: getRuleByType('from-min'),
    minMessage: 'Req: Non-Zero value not more than 50 blocks height from END.',
    max: getRuleByType('from-max'),
    maxMessage: 'Req: less than (<) BlockNumber (END)'
  });
  const toBlockRules = useNumberRule({
    required: () => requiredFlag.current,
    requiredMessage: `Blocknumber required (START < +int-END < best BlockNumber)`,
    min: getRuleByType('to-min'),
    minMessage: 'Req: START < +int-END, not more than 50 blocks height from START.',
    max: getRuleByType('to-max'),
    maxMessage: 'Req: (<=) best BlockNumber, not more than 50 blocks height from START'
  });
  const rpcRules = useRPCRule({ WSS_REGEX: /^(wss|ws):\/\/([a-zA-Z0-9]{0,9}(?:\.[a-zA-Z0-9]{0,9}){0,}|[a-zA-Z0-9]+):?([0-9]{0,5})/gmi});

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

  const resetQueryState = useCallback(() => {
    setSearchParams(null);
    setSearching(false);
    setErrorMessage(``);
  }, [setSearchParams,setSearching,setErrorMessage]);

  const handlePreCheck = useCallback(async () => {
    try {
      await form.validateFields();
    } 
    catch (e) {
        setErrorMessage('Whoops: Validation Error. Ctrl+F5 or use defaults by going idle for ease');
        return false;
    }
    return true;
  }, [form]);

  // Scan for Blocks
  const scan = useCallback(async () => {
    const _cached = { 
      from: dataRef.current.fromBlockNumber,
      to: dataRef.current.toBlockNumber,
      rpcUrl: dataRef.current.rpcUrl
    };
    isSearching && resetQueryState();
    if (await handlePreCheck() && isNumber(_cached.from) && isNumber(_cached.to)) {
      if (POLKAENDPOINT !== _cached.rpcUrl) {
          api.disconnect();
          setFirstEndpointRef.current({'url': _cached.rpcUrl});
      }
      setErrorMessage(``);
      setSearching(true);
      const from = new BN(_cached.from) as BlockNumber;
      const to = new BN(_cached.to) as BlockNumber;
      setSearchParams({from, to} as BlockNumberProps);
      isDefaultSet.current = false;
    } else
        setErrorMessage(`Try + numbers or simply go idle for defaults.`);
  }, [api, dataRef, handlePreCheck, isDefaultSet, setFirstEndpointRef, isSearching, resetQueryState]);

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
        rpcUrl: POLKAENDPOINT,
        toBlockNumber: num
      };
      initFormData.toBlockNumber = num;

      update(_data);
      form.setFieldsValue(_data);
      return Promise.resolve();

    }, [api, update, form, initFormData]);

  // MAIN Side-effect: Check Idle or setDefaultsNeed --> set latest bestNumber Defaults to form.
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
          initialValue={initFormData.fromBlockNumber}
          name='fromBlockNumber'
          rules={fromBlockRules}
        >
          <Input 
            prefix={(<CPrefix>Blocknumber (START):</CPrefix>)}
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
            prefix={(<CPrefix>Blocknumber (END):</CPrefix>)}
            onFocus={onFocusFields}
            onBlur={onBlurFields}
          />
        </CFormItem>

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

        {!isEmpty(errorMessage) && ( 
              <ErrorBtn
                disabled
              >
                {errorMessage}
              </ErrorBtn>
        )}
        <SearchBtn
          onClick={() => scan()}
        >
          {'Scan'}
          
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

export default Explorer;