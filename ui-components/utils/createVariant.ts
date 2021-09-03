import { DefaultTheme } from 'styled-components';

type GenerateFN<T> = (params: T) => string;

type Config<T> = Record<string, GenerateFN<T>>;

export function createVariant<T extends { theme: DefaultTheme, variant?: string } > (config: Config<T>) {
  return (params: T): string => {
    const { variant } = params;

    if (!variant) return '';

    if (variant.includes(' ')) {
      const temp = variant.split(' ');

      return temp.map((item) => {
        const fn = config[item ?? ''];

        if (!fn) return '';

        return fn(params);
      }).join(';');
    }

    const fn = config[variant ?? ''];

    if (!fn) return '';

    return fn(params);
  };
}
