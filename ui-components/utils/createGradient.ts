import { rgba } from 'polished';
import { DefaultTheme } from 'styled-components';

export const createTextGradient = (type: string) => ({ theme }: {theme: DefaultTheme}) => {
  switch (type) {
    case 'primary': return `
      background-image: linear-gradient(61.97deg, ${theme.colors.primary1} -2.84%, ${theme.colors.primary2} 86.13%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    `;
  }

  return '';
};

export const createBackgroundGradient = (type: string) => ({ theme }: {theme: DefaultTheme}) => {
  switch (type) {
    case 'primary': return `
        background-image: linear-gradient(61.97deg, ${theme.colors.primary1} -2.84%, ${theme.colors.primary2} 86.13%);
        background-origin: border-box;
        background-repeat: no-repeat;
        background-clip: padding-box;
    `;
  }

  return '';
};

export const createBorderGradient = (type: string, param1?: string, params2?: string) => ({ theme }: {theme: DefaultTheme}) => {
  switch (type) {
    case 'primary': return `
        border: 1px solid transparent;
        background-image: linear-gradient(101.18deg, ${rgba(theme.colors.gray7, 0)} 1.64%, ${rgba(theme.colors.gray7, 0.1)} 112.71%),
        linear-gradient(${theme.colors.gray0}, ${theme.colors.gray0}),
        linear-gradient(50.94deg, ${rgba(theme.colors.primary2, 0)} 48.71%, ${rgba(theme.colors.primary1, 0.6)} 94.76%);
        background-origin: border-box;
        background-repeat: no-repeat;
        background-clip: padding-box, padding-box, border-box;
    `;
    case 'card': return `
        border: 1px solid transparent;
        background-image: linear-gradient(${theme.colors.gray0}, ${theme.colors.gray0}),
        linear-gradient(50.94deg, ${rgba(theme.colors.primary2, 0)} 48.71%, ${rgba(theme.colors.primary1, 0.6)} 94.76%);
        background-origin: border-box;
        background-repeat: no-repeat;
        background-clip: padding-box, border-box;
    `;
    case 'card-tab': return `
        border: 1px solid transparent;
        background-image: 
          linear-gradient(${param1 ?? theme.colors.gray0}, ${param1 ?? theme.colors.gray0}),
          linear-gradient(61.97deg, #FF4C3B -2.84%, #E40C5B 86.13%);
        background-origin: border-box;
        background-repeat: no-repeat;
        background-clip: padding-box, border-box;
    `;
    case 'button': return `
        border: 1px solid transparent;
        background-image: 
          linear-gradient(101.18deg, ${rgba(theme.colors.gray7, 0.1)} 1.64%, ${rgba(theme.colors.gray7, 0.1)} 112.71%),
          linear-gradient(${param1 ?? theme.colors.gray0}, ${param1 ?? theme.colors.gray0}),
          linear-gradient(61.97deg, #FF4C3B -2.84%, #E40C5B 86.13%);
        background-origin: border-box;
        background-repeat: no-repeat;
        background-clip: padding-box, padding-box, border-box;
    `;
    case 'custom': return `
        border: 1px solid transparent;
        background-image: 
          linear-gradient(${param1 ?? theme.colors.gray0}, ${param1 ?? theme.colors.gray0}),
          ${params2 || ''};
        background-origin: border-box;
        background-repeat: no-repeat;
        background-clip: padding-box, border-box;

    `;
  }

  return '';
};
