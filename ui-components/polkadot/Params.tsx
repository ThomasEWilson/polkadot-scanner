import type { GenericEventData } from '@polkadot/types';
import type { TypeDef, Codec } from '@polkadot/types/types';
import React, { useEffect, useState } from 'react';
import { Table } from '../';

export interface ParamDef {
  length?: number;
  name?: string;
  type: TypeDef;
}

interface Value {
  isValid: boolean;
  value: Codec;
}

interface Props {
  children?: React.ReactNode;
  params?: ParamDef[] | null;
  values?: Value[] | null;
}

function Params ({ params: pParams, values: pValues}: Props): React.ReactElement<Props> | null {
  const [params, setParams] = useState<ParamDef[]>([]);
  const [values, setValues] = useState<any[]>([]);

  useEffect((): void => {
    pParams && setParams(pParams);
  }, [pParams]);

  useEffect((): void => {
    pValues && setValues(pValues);
  }, [pValues]);

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
            <Table.Cell width='16%'>
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