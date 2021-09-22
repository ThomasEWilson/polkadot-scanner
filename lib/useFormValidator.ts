import type { Rule } from '/ui-components/Form';

import { isFunction, isNumber, isString, isNull } from 'lodash';
import { useMemo } from 'react';

import { useMemorized } from './useMemorized';

function getNumber (num: number): string {
  if (typeof num === 'number') return num + '';

  return '0';
}

function getFunctionableValue (value: any) {
  if (isFunction(value)) return value();

  return value;
}

function toNumber (num: number): number {
  if (typeof num === 'number') return num

  return 0;
}

function getValue (value: any): any {
  return isNumber(value) 
          ? value
          : isString(value) 
            ? value.toString() : ''
}

interface NumberRule {
  max?: number;
  maxMessage?: string;
  min?: number;
  minMessage?: string;
  required?: boolean | (() => boolean);
  requiredMessage?: string;
}

export const useNumberRule = (config?: NumberRule): Rule[] => {
  const _config = useMemorized(config);

  const rules = useMemo(() => {
    return [
      {
        validator: async (_rules: any, value: any): Promise<string | void> => {
          const _value = getValue(value);

          if (_config?.max && toNumber(_config?.max) < _value) throw new Error(_config?.maxMessage || `Max is ${getNumber(_config?.max)}`);

          if (_config?.min && toNumber(_config?.min) > _value) throw new Error(_config?.maxMessage || `Min is ${getNumber(_config?.min)}`);

          if (getFunctionableValue(_config?.required) && (!_value)) throw new Error(_config?.requiredMessage || 'Valid BlockNumber is required');

          return Promise.resolve();
        }
      }
    ] as any;
  }, [_config]);

  return rules;
};

interface RPCRule {
  webSocketMessage?: string
  required?: boolean | (() => boolean);
  requiredMessage?: string;
}

const REGEX_WEBSOCKET = /^(wss?:\/\/)([a-zA-Z0-9]{0,9}(?:\.[a-zA-Z0-9]{0,9}){0,9}|[a-zA-Z0-9]+):?([0-9]{0,5})/gmi;
export const useRPCRule = (config?: RPCRule): Rule[] => {
  const _config = useMemorized(config);
  
  const rules = useMemo(() => {
    return [
      {
        validator: async (_rules: any, value: any): Promise<string | void> => {
          const _value = getValue(value)
          
          if (isNull(REGEX_WEBSOCKET.exec(_value))) throw new Error(_config?.webSocketMessage || `Please enter Valid WebSocket URL`);

          if (getFunctionableValue(_config?.required) && (!_value)) throw new Error(_config?.requiredMessage || 'Valid WebSocket URL Required');

          return Promise.resolve();
        }
      }
    ] as any;
  }, [_config]);

  return rules;
};
