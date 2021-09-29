// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '/ui-components/explorer/types';
import type { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { Table, Card } from '/ui-components';
import { useApi } from '/react-environment/state/modules/api/hooks';

import ExtrinsicDisplay from './Extrinsic';
import styled from 'styled-components';
import { Col, Row } from 'antd';



const TableHeaderCell = styled(Table.Cell)`
  text-transform: uppercase;
`;

interface Props {
  blockNumber?: BlockNumber;
  className?: string;
  events?: KeyedEvent[];
  label?: React.ReactNode;
  value?: Extrinsic[] | null;
}

function Extrinsics ({ blockNumber, className = '', events, label, value }: Props): React.ReactElement<Props> {

  const api = useApi();

  return (
      <Row gutter={[24, 25]}>
        <Col span={24}>
          <Card variant='gradient-border'>
            <Card.Header>
              {'Extrinsics'}
            </Card.Header>
            <Card.Content>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <TableHeaderCell align='left'>{'extrinsics'}</TableHeaderCell>
                    <TableHeaderCell>{'events'}</TableHeaderCell>
                    <TableHeaderCell>{'signer'}</TableHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                {value?.map((extrinsic, index): React.ReactNode =>
                  <ExtrinsicDisplay
                    blockNumber={blockNumber}
                    events={events}
                    index={index}
                    key={`extrinsic:${index}`}
                    value={extrinsic}
                  />
                )}
                </Table.Body>
              </Table>
            </Card.Content>
          </Card>
        </Col>
      </Row>
  );
}

export default React.memo(Extrinsics);

    /* <Table
      className={className}
    >
      <Table.Header>
        {header}
      </Table.Header>
      <Table.Body>
        {value?.map((extrinsic, index): React.ReactNode =>
          <ExtrinsicDisplay
            blockNumber={blockNumber}
            events={events}
            index={index}
            key={`extrinsic:${index}`}
            maxBlockWeight={api.consts.system.blockWeights.maxBlock}
            value={extrinsic}
          />
        )}
      </Table.Body>
    </Table> */