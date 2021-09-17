// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import React, { useState } from 'react';

import { useApi } from '/react-environment/state/modules/api/hooks';
import { useIsMountedRef } from '/lib/useIsMountedRef';

import FormatBalance from '../FormatBalance';
import { useSubscription } from '/lib';
import { switchMap } from 'rxjs';
import { isNull, isUndefined, u8aToString, isU8a } from '@polkadot/util';
import addressToAddress from '../util/toAddress';
import { GenericAccountIndex, GenericMultiAddress } from '@polkadot/types';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}
type AccountParam = Props[`params`];

export const validateGenericAccountId = (params: AccountParam): string | AccountIndex | Address | AccountId => {
  const notNever = !isNull(params) && !isUndefined(params);
  return notNever && isU8a(params)
          ? u8aToString(params)
          : notNever && (params instanceof GenericAccountIndex || params instanceof GenericMultiAddress)
            ? params
            : ''
}

function BalanceDisplay({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const api = useApi();
  const [allBalances, setAllBalances] = useState<DeriveBalancesAll>();
  const mountedRef = useIsMountedRef();

  const searchParam = validateGenericAccountId(params)
  useSubscription(() =>
    api.isReady
      .pipe(
        switchMap((api) =>
          api.derive.balances.all(searchParam)
        )
      )
      .subscribe({
        next: (h) => mountedRef && setAllBalances(h),
        error: (e) => mountedRef && console.error(e),
        complete: () => console.log('Event Complete: Switching Providers or Losing connection to Node')
      }
      ), [api]
  )


  return (
    <FormatBalance
      className={className}
      label={label}
      value={allBalances?.freeBalance}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(BalanceDisplay);
