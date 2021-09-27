// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Text } from '@polkadot/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import LabelHelp from './LabelHelp';
import { useToggle } from '/lib';
import { Collapse } from 'antd';

import Icon from './Icon';

interface Meta {
  docs: Text[];
}

export interface Props {
  children?: React.ReactNode;
  className?: string;
  help?: string;
  helpIcon?: string;
  isOpen?: boolean;
  isPadded?: boolean;
  onClick?: (isOpen: boolean) => void;
  renderChildren?: () => React.ReactNode;
  summary?: React.ReactNode;
  summaryHead?: React.ReactNode;
  summaryMeta?: Meta;
  summarySub?: React.ReactNode;
  withBreaks?: boolean;
  withHidden?: boolean;
}

const splitSingle = (value: string[], sep: string): string[] => {
  return value.reduce((result: string[], value: string): string[] => {
    return value.split(sep).reduce((result: string[], value: string) => result.concat(value), result);
  }, []);
}

const splitParts = (value: string): string[] => {
  return ['[', ']'].reduce((result: string[], sep) => splitSingle(result, sep), [value]);
}

const formatMeta = (meta?: Meta): React.ReactNode | null => {
  if (!meta || !meta.docs.length) {
    return null;
  }

  const strings = meta.docs.map((d) => d.toString().trim());
  const firstEmpty = strings.findIndex((d) => !d.length);
  const combined = (
    firstEmpty === -1
      ? strings
      : strings.slice(0, firstEmpty)
  ).join(' ').replace(/#(<weight>| <weight>).*<\/weight>/, '');
  const parts = splitParts(combined.replace(/\\/g, '').replace(/`/g, ''));

  return <>{parts.map((part, index) => index % 2 ? <em key={index}>[{part}]</em> : <span key={index}>{part}</span>)}&nbsp;</>;
}

const { Panel } = Collapse;

const Expander = ({ children, className = '', help, helpIcon, isOpen, isPadded, onClick, renderChildren, summary, summaryHead, summaryMeta, summarySub, withBreaks, withHidden }: Props): React.ReactElement<Props> => {

  const [isExpanded, toggleExpanded] = useToggle(isOpen, onClick);

  const demandChildren = useMemo(
    () => isExpanded && renderChildren && renderChildren(),
    [isExpanded, renderChildren]
  );

  const CHeaderMain = useMemo(
    () => summary || formatMeta(summaryMeta) || <>{'Details'}</>,
    [summary, summaryMeta]
  );

  const headerSub = useMemo(
    () => summary ? (formatMeta(summaryMeta) || summarySub) : <>{' '}</>,
    [summary, summaryMeta, summarySub]
  );

  const hasContent = useMemo(
    () => !!renderChildren || (!!children && (!Array.isArray(children) || children.length !== 0)),
    [children, renderChildren]
  );


  return (
    <>
      <Collapse
        bordered={false}
        collapsible='disabled'
      >
        <Panel header={CHeaderMain} key="1" extra={headerSub}>
          {hasContent && 
            (<div className='ui--Expander-content'>{children || demandChildren}</div>)}
        </Panel>
      
      </Collapse>
    </>
  );
}

export default React.memo(styled(Expander)`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &.isExpanded .ui--Expander-content {
    margin-top: 0.5rem;

    .body.column {
      justify-content: end;
    }
  }

  .ui--Expander-summary {
    margin: 0;
    min-width: 13.5rem;
    overflow: hidden;

    .ui--Expander-summary-header {
      display: inline-block;
      max-width: calc(100% - 2rem);
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
      white-space: nowrap;

      span {
        white-space: normal;
      }
    }

    .ui--Icon {
      margin-left: 0.75rem;
      vertical-align: middle;
    }

    .ui--LabelHelp {
      .ui--Icon {
        margin-left: 0;
        margin-right: 0.5rem;
        vertical-align: text-bottom;
      }
    }

    .ui--Expander-summary-header-sub {
      font-size: 1rem;
      opacity: 0.6;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`);
