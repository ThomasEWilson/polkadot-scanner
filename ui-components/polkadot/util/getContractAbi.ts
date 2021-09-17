// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyJson } from '@polkadot/types/types';

import { Abi } from '@polkadot/api-contract';


import getAddressMeta from './getAddressMeta';
import { GenericChainProperties } from '@polkadot/types';

export default function getContractAbi (address: string | null, chainProps: GenericChainProperties | undefined): Abi | null {
  if (!address) {
    return null;
  }
  let abi: Abi | undefined;
  const meta = getAddressMeta(address, 'contract');

  try {
    const data = meta.contract && JSON.parse(meta.contract.abi) as AnyJson;

    abi = new Abi(data, chainProps);
  } catch (error) {
    console.error(error);
  }

  return abi || null;
}
