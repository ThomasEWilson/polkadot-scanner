import type { GenericEventData } from '@polkadot/types';
import type { TypeDef, Codec } from '@polkadot/types/types';
import React, { useEffect, useState } from 'react';
import { isArray } from 'lodash'
import { Table } from '../';

export interface ParamDef {
  name?: string;
  type: TypeDef;
}

interface Value {
  isValid: boolean;
  value: Codec;
}

interface Props {
  children?: React.ReactNode;
  params?: ParamDef[] | ParamDef | null;
  values?: Value[] | Value | null;
}

const setState = (params, values, dispatchParams) => {

}

function Params ({ children, params: pParams, values: pValues}: Props): React.ReactElement<Props> | null {
  const [params, setParams] = useState<ParamDef[]>([]);
  const [values, setValues] = useState<any[]>([]);

  useEffect((): void => {
    const doSet = () => {
      if (pParams)
        setParams( !isArray(pParams) ? [pParams] : pParams)
      if (pValues)
        setValues( !isArray(pValues) ? [pValues] : pValues);
    }
    doSet();
  }, [pParams, pValues]);

  if (!params.length) {
    return null;
  }

  return (
    <Table
      className='params'
    >
      <Table.Body>
        {params && params.map(({ name, type }, key): React.ReactNode => (
          <Table.Row key={key}>
            <Table.Cell>
              {name}
            </Table.Cell>
            <Table.Cell>
              {type}
            </Table.Cell>
          </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  );
}

export default React.memo(Params);