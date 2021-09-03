import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form, FormItem } from '../../ui-components/Form';


export const Inner: FC = () => {
    
    const { t } = useTranslation('page-swap');
    const isEnabled = useSwapEnabled();
    const [parameters, setParameters] = useState<SwapParameters | undefined>();
    const current = useCurrentOrTargetAccount();
  
    const { config, swap, updateConfig } = useSwap();
    const { nativeToken, stableToken } = usePresetTokens();
  
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [form] = Form.useForm<FormData>();
    const tradeModeRef = useRef<SwapTradeMode>('EXACT_INPUT');
    const subscription = useRef<Subscription>();
  
    const enableTokens = useSwapEnableTokens();
    const enableTradingPairs = useEnabledLiquidityPools('TokenPair');
  
    const initData = useMemo(() => ({
      input: { amount: 0, token: stableToken },
      output: { amount: 0, token: nativeToken }
    }), [nativeToken, stableToken]);
  
    const { data, dataRef, update } = useDataChanger<FormData>(initData);
  
    const requiredFlag = useRef<boolean>(false);
  
    const inputRules = useBalanceRule(data.input?.token, {
      required: () => requiredFlag.current,
      transferCheck: {
        account: current,
        amount: new FixedPointNumber(data.input?.amount || 0, (data.input?.token as any as Token).decimal),
        currency: data?.input?.token,
        direction: 'from',
        message: 'The account balance will be too low and removed. Read more on Existential Deposit.'
      }
    });
  
    const outputRules = useNumberRule({
      required: () => requiredFlag.current,
      transferCheck: {
        account: current,
        amount: new FixedPointNumber(data.output?.amount || 0, (data.output?.token as any as Token).decimal),
        currency: data?.output?.token,
        direction: 'to',
        message: 'The account balance will be too low and removed. Read more on Existential Deposit.'
      }
    });
  
    const maxInputBalance = useBalance(data?.input?.token);
    const outputBalance = useBalance(data?.output?.token);
  
    const setInputValue = useCallback((num?: FixedPointNumber) => {
      const _data = { input: dataRef.current.input };
  
      _data.input.amount = num?.toString() || '';
  
      update(_data);
      form.setFieldsValue(_data);
    }, [dataRef, form, update]);
  
    const setOutputValue = useCallback((num?: FixedPointNumber) => {
      const _data = { output: dataRef.current.output };
  
      _data.output.amount = num?.toString() || '';
  
      update(_data);
      form.setFieldsValue(_data);
    }, [dataRef, form, update]);
  
    const handleReverse = useCallback(() => {
      const _data = {
        input: dataRef.current.output,
        output: dataRef.current.input
      };
  
      _data.input.amount = 0;
      _data.output.amount = 0;
  
      form.setFieldsValue(_data);
      update(_data);
      setParameters(undefined);
    }, [form, dataRef, update, setParameters]);
  
    const [payTokenSelectorProps, receiveTokenSelectorProps] = useMemo((): [TokenSelectorProps, TokenSelectorProps] => {
      const usedTokens: MaybeCurrency[] = [];
  
      if (data?.output?.token) {
        usedTokens.push(data.output.token);
      }
  
      if (data?.input?.token) {
        usedTokens.push(data.input.token);
      }
  
      const inner = (type: 'input' | 'output') => {
        return enableTokens.map((token) => {
          const isUsed = !!usedTokens.find((item) => forceToCurrencyIdName(item) === forceToCurrencyIdName(token));
          const isInput = data?.input?.token ? forceToCurrencyIdName(data.input.token) === forceToCurrencyIdName(token) : false;
          const isOutput = data?.output?.token ? forceToCurrencyIdName(data.output.token) === forceToCurrencyIdName(token) : false;
  
          return {
            disabled: type === 'input' ? isInput : type === 'output' ? isOutput : false,
            noSort: isUsed,
            onClick: type === 'input' && isOutput ? handleReverse : type === 'output' && isInput ? handleReverse : undefined,
            token: token,
            ui: isUsed ? 'disabled' : 'normal'
          };
        }).sort((item): number => {
          const token = item.token;
          const isUsed = !!usedTokens.find((item) => forceToCurrencyIdName(item) === forceToCurrencyIdName(token));
  
          return isUsed ? -1 : 1;
        });
      };
  
      return [
        { autoDisableZeroBalance: false, selectableTokens: inner('input') },
        { autoDisableZeroBalance: false, selectableTokens: inner('output') }
      ];
    }, [enableTokens, data, handleReverse]);
  
    const swapFn = useMemo(() => debounce(
      (path: [Token, Token], amount: FixedPointNumber, mode: SwapTradeMode) => {
        subscription.current = swap.swap(path, amount, mode).subscribe({
          error: (error: Error) => {
            if (dataRef.current.input.amount !== 0) {
              switch (error.name) {
                case 'AmountTooSmall' : {
                  setErrorMessage('Enter An Amount');
                  break;
                }
  
                case 'InsufficientLiquidity': {
                  setErrorMessage('Insufficient Liquidity');
                  break;
                }
              }
            }
  
            if (error.name === 'AmountTooSmall' || error.name === 'InsufficientLiquidity') {
              switch (mode) {
                case 'EXACT_INPUT' : {
                  setOutputValue();
                  break;
                }
  
                case 'EXACT_OUTPUT' : {
                  setInputValue();
                  break;
                }
              }
            }
          },
          next: (result) => {
            if (!result.input) return;
  
            setErrorMessage('');
            setParameters(result);
  
            if (mode === 'EXACT_INPUT') {
              setOutputValue(result.output.balance);
            } else {
              setInputValue(result.input.balance);
            }
          }
        });
      }, 200), [dataRef, swap, setOutputValue, setInputValue, setErrorMessage, setParameters]);
  
    const handleInput = useCallback((type: 'input' | 'output', mode: SwapTradeMode, data: BalanceInputValue) => {
      if (subscription.current) subscription.current.unsubscribe();
  
      const ref = dataRef.current;
      const inputToken = (type === 'input' ? data.token : ref.input.token) as Token;
      const outputToken = (type === 'output' ? data.token : ref.output.token) as Token;
  
      const amount = new FixedPointNumber(
        mode === 'EXACT_INPUT'
          ? (type === 'input' ? data.amount : ref.input.amount)
          : (type === 'input' ? ref.output.amount : data.amount),
        mode === 'EXACT_INPUT' ? inputToken.decimal : outputToken.decimal
      );
  
      swapFn([inputToken, outputToken], amount, mode);
    }, [swapFn, dataRef]);
  
    const handleValueChange = useCallback((changed: Partial<FormData>) => {
      if (changed.input) {
        const shouldUpdateTradeMode = changed.input.amount !== dataRef.current.input.amount && tokenEq(changed.input.token, dataRef.current.input.token);
  
        if (shouldUpdateTradeMode && tradeModeRef.current !== 'EXACT_INPUT') {
          updateConfig({ tradeMode: 'EXACT_INPUT' });
          tradeModeRef.current = 'EXACT_INPUT';
        }
  
        if (changed.input.amount === 0) setParameters(undefined);
  
        handleInput('input', tradeModeRef.current, changed.input);
      }
  
      if (changed.output) {
        const shouldUpdateTradeMode = changed.output.amount !== dataRef.current.output.amount && tokenEq(changed.output.token, dataRef.current.output.token);
  
        if (shouldUpdateTradeMode && tradeModeRef.current !== 'EXACT_OUTPUT') {
          updateConfig({ tradeMode: 'EXACT_OUTPUT' });
          tradeModeRef.current = 'EXACT_OUTPUT';
        }
  
        if (changed.output.amount === 0) setParameters(undefined);
  
        handleInput('output', tradeModeRef.current, changed.output);
      }
  
      update(changed);
    }, [dataRef, update, updateConfig, handleInput, setParameters]);
  
    const handleInputMax = useCallback(() => {
      if (!dataRef.current?.input?.token) return;
  
      setInputValue(maxInputBalance);
      handleValueChange({ input: { amount: maxInputBalance.toNumber(), token: dataRef.current.input.token } });
    }, [dataRef, maxInputBalance, setInputValue, handleValueChange]);
  
    const handleSuccess = useCallback(() => {
      const _data = { ...dataRef.current };
  
      _data.input.amount = 0;
      _data.output.amount = 0;
  
      form.setFieldsValue(_data);
      update(_data);
      setParameters(undefined);
    }, [dataRef, form, update, setParameters]);
  
    const params = useMemo(() => {
      if (!parameters || !parameters.input) return;
  
      const result = parameters.toChainData();
      const { slippage, tradeMode } = config;
  
      if (slippage && tradeMode === 'EXACT_INPUT') {
        result[2] = FixedPointNumber.fromInner(result[2]).times(new FixedPointNumber(1 - slippage)).toChainData();
      }
  
      if (slippage && tradeMode === 'EXACT_OUTPUT') {
        result[2] = FixedPointNumber.fromInner(result[2]).times(new FixedPointNumber(1 + slippage)).toChainData();
      }
  
      return result;
    }, [parameters, config]);
  
    const { call, feeData } = useExtrinsic({
      method: config.tradeMode === 'EXACT_INPUT' ? 'swapWithExactSupply' : 'swapWithExactTarget',
      params: params,
      section: 'dex'
    });
  
    const handlePreCheck = useCallback(async () => {
      try {
        requiredFlag.current = true;
  
        await form.validateFields();
      } catch (e) {
        return false;
      } finally {
        requiredFlag.current = false;
      }
  
      return true;
    }, [form, requiredFlag]);
  
    useEffect(() => {
      if (!enableTradingPairs.length) return;
  
      const [token1, token2] = enableTradingPairs[0].getPair();
  
      update({
        input: { amount: 0, token: token1 },
        output: { amount: 0, token: token2 }
      });
  
      form.setFieldsValue({
        input: { amount: 0, token: token1 },
        output: { amount: 0, token: token2 }
      });
    }, [enableTradingPairs, update, form]);
    
    return (
        <CForm
          form={form}
          onValuesChange={handleValueChange}
        >
          <CCard variant='gradient-border'>
            <Title>
              {t('Pay With')}
              <Addon>
                {
                  config.tradeMode === 'EXACT_OUTPUT' && !!maxInputBalance
                    ? t('Estimated')
                    : null
                }
              </Addon>
            </Title>
            <FormItem
              initialValue={initData.input}
              name='input'
              rules={inputRules}
            >
              <CBalanceInput
                enableTokenSelector
                noBorder
                // onMax={handleInputMax}
                tokenSelectorProps={payTokenSelectorProps}
              />
            </FormItem>
            <TokenInformation>
              <MarketValue amount={new FixedPointNumber(data.input?.amount || 0, (data.input?.token as any).decimal)}
                token={data.input?.token} />
              <div>
                <span>{t('Balance')}</span>
                <CFormatBalance balance={maxInputBalance} />
              </div>
            </TokenInformation>
            <FlexBox justifyContent='center'>
              <CSwapExchangeIcon onClick={handleReverse} />
            </FlexBox>
            <Title>
              {t('Receive')}
              <Addon>
                {config.tradeMode === 'EXACT_INPUT' ? t('Estimated') : ''}
              </Addon>
            </Title>
            <FormItem
              initialValue={initData.output}
              name='output'
              rules={outputRules}
            >
              <CBalanceInput
                enableTokenSelector
                noBorder
                tokenSelectorProps={receiveTokenSelectorProps}
              />
            </FormItem>
            <TokenInformation>
              <MarketValue amount={new FixedPointNumber(data.output?.amount || 0, (data.output?.token as any).decimal)}
                token={data.output?.token} />
              <div>
                <span>{t('Balance')}</span>
                <CFormatBalance balance={outputBalance} />
              </div>
            </TokenInformation>
            <SwapInfo
              acceptSlippage={config.slippage}
              fee={feeData}
              parameters={parameters}
            />
            {
              errorMessage
                ? (
                  <ErrorBtn
                    disabled={true}
                    size='large'
                  >
                    {errorMessage}
                  </ErrorBtn>
                )
                : (
                  <CTxButton
                    call={call}
                    disabled={!isEnabled}
                    onExtrinsicSuccsss={handleSuccess}
                    preCheck={handlePreCheck}
                    size='large'
                  >
                    {t('Swap')}
                  </CTxButton>
                )
            }
          </CCard>
        </CForm>
      );
}








export const SwapConsole: FC = () => {
    return (
      <SwapProvider>
        <EnsureSwapIsReady>
          <Inner />
        </EnsureSwapIsReady>
      </SwapProvider>
    );
};