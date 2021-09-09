// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, Tuple } from '@polkadot/types';
import type { Justification } from '@polkadot/types/interfaces';
import type { Codec, TypeDef } from '@polkadot/types/types';

import React from 'react';

import { Expander, Table } from '@polkadot/react-components';
import Params from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types/create';


interface Props {
  value: Justification;
}

function formatTuple (tuple: Tuple): React.ReactNode {
  const params = tuple.Types.map((type): { type: TypeDef } => ({
    type: getTypeDef(type)
  }));
  const values = tuple.toArray().map((value): { isValid: boolean; value: Codec } => ({
    isValid: true,
    value
  }));

  return (
    <Params
      isDisabled
      params={params}
      values={values}
    />
  );
}

function Justifications ({ value }: Props): React.ReactElement<Props> | null {

  const header = ['justification', 'start'];

  const justification = value;

  if (!justification) {
    return null;
  }

  return (
    <Table
    >
      <Table.Head>
          {header}
      </Table.Head>
      <Table.Body>
      {justification && (
          <tr key={`justification`}>
            <td className='overflow'>
              <Expander summary={justification.toString()}>
                {formatTuple(justification as unknown as Tuple)}
              </Expander>
            </td>
          </tr>
        )}
      </Table.Body>
    </Table>
  );
}

export default React.memo(Justifications);
