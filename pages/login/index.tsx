import { NextPage } from 'next'
import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react'
import { Subscription } from 'rxjs';
import styled from 'styled-components'
import {Input} from 'antd'

import useUser from '../../lib/useUser'
import { Button, Card, FlexBox, Form } from '/ui-components'
import {flexBox, typography} from '/ui-components/utils'
import { useDataChanger } from '../../lib'
import { debounce } from 'lodash'
import { FormItem } from '/ui-components/Form'
import { useSetTitle } from '/react-environment/state/modules/application/hooks';


// import fetchJson from '../../lib/fetchJson'

const CForm = styled(Form)`
  margin-top: 60px;

  & .ant-form-item {
    margin-bottom: 0;
  }
`;

const LoginBtn = styled(Button)`  
margin: 32px auto 0 auto;
padding: 0 40px;
width: 320px;`

const Title = styled.div`
  ${flexBox('space-between', 'center')};
  ${typography(14, 17, 500, 'gray4')};
  margin-bottom: 20px;
`;

const ErrorBtn = styled(LoginBtn).attrs({ as: Button })``;

const CCard = styled(Card)`
  margin: 36px auto;
  width: 560px;
  padding: 36px 24px;
  background: linear-gradient(101.18deg, rgba(255, 255, 255, 0) 1.64%, rgba(255, 255, 255, 0.1) 112.71%) no-repeat border-box padding-box, linear-gradient(rgb(34, 34, 34), rgb(34, 34, 34)) padding-box, linear-gradient(50.94deg, rgba(228, 12, 91, 0) 48.71%, rgba(255, 76, 59, 0.6) 94.76%) border-box rgb(34, 34, 34);
`;

interface FormData {
  password: string;
}

const Login: NextPage = () => {
  // Grab User, redirect to scanner if Authorized.
  const { mutateUser } = useUser({
    redirectTo: 'explorer',
    redirectIfFound: true,
  })

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [form] = Form.useForm<FormData>();
  const subscription = useRef<Subscription>();
  const setTitle = useSetTitle();

  // const initData = useMemo(() => ({
  //   input: { amount: 0, token: stableToken },
  //   output: { amount: 0, token: nativeToken }
  // }), [nativeToken, stableToken]);
  const initData: FormData = { password: '' };

  const { data, dataRef, update } = useDataChanger<FormData>(initData);

  useEffect(() => setTitle('Login'), [setTitle]);


  const setInputValue = useCallback((num?: string) => {
    const _data = { password: dataRef.current.password };

    _data.password = num?.toString() || '';

    update(_data);
    form.setFieldsValue(_data);
  }, [dataRef, form, update]);

  const loginFn = useCallback((password: string) => debounce(
    (password: string) => {
      // LOGIN instead of swap, fetchJson IronSession w/ Argon2 encryption

      // subscription.current = swap.swap(password).subscribe({
      //   error: (error: Error) => {
      //       setErrorMessage('Incorrect Password -- Please try again');
      //   },
      //   next: (result) => {
      //     if (!result.isValid) return;
      //     setErrorMessage('');
      //     mutateUser(result.user)
      //   }
      // });

    }, 500), []);

  const handleInput = useCallback((data: string) => {

    loginFn(data);
  }, [loginFn]);

  const handleValueChange = useCallback((changed: Partial<FormData>) => {
    if (changed.password) {
      if (changed.password.length < 14) return
      handleInput(changed.password);
    }
  }, [handleInput]);


  return (
    <CForm
      form={form}
      onValuesChange={handleValueChange}
    >
      <CCard variant='gradient-border'>
        <FlexBox justifyContent='center'>
          {/* image */}
        </FlexBox>
        <Title>

        </Title>
        <FormItem
          initialValue={initData.password}
          name='password'
          rules={[{ required: true, message: 'Please Input the App Password!' }]}
        >
          <Input.Password/>
        </FormItem>

        <Title>
         
        </Title>
        {
          errorMessage
            ? (
              <ErrorBtn>
                {errorMessage}
              </ErrorBtn>
            )
            : (
              <LoginBtn>
                {'Login'}
              </LoginBtn>
            )
        }
      </CCard>
    </CForm>
  );
}

export default Login
