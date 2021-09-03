import { rgba } from 'polished';
import { DefaultTheme } from 'styled-components';

export const createTextGradient = (type: string) => ({ theme }: {theme: DefaultTheme}) => {
  switch (type) {
    case 'primary': return `
      background-image: linear-gradient(61.97deg, #FF4C3B -2.84%, #FF4C3B 86.13%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    `;
  }

  return '';
};

export const createBackgroundGradient = (type: string) => ({ theme }: {theme: DefaultTheme}) => {
  switch (type) {
    case 'primary': return `
        background-image: linear-gradient(61.97deg, #FF4C3B -2.84%, #FF4C3B 86.13%);
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
        background-image: linear-gradient(101.18deg, ${rgba('#FFFFFF', 0)} 1.64%, ${rgba('#FFFFFF', 0.1)} 112.71%),
        linear-gradient(#222222, #222222),
        linear-gradient(50.94deg, ${rgba('#E40C5B', 0)} 48.71%, ${rgba('#FF4C3B', 0.6)} 94.76%);
        background-origin: border-box;
        background-repeat: no-repeat;
        background-clip: padding-box, padding-box, border-box;
    `;
    case 'card': return `
        border: 1px solid transparent;
        background-image: linear-gradient(#222222, #222222),
        linear-gradient(50.94deg, ${rgba('#E40C5B', 0)} 48.71%, ${rgba('#FF4C3B', 0.6)} 94.76%);
        background-origin: border-box;
        background-repeat: no-repeat;
        background-clip: padding-box, border-box;
    `;
    case 'card-tab': return `
        border: 1px solid transparent;
        background-image: 
          linear-gradient(${param1 ?? '#222222'}, ${param1 ?? '#222222'}),
          linear-gradient(61.97deg, #FF4C3B -2.84%, #E40C5B 86.13%);
        background-origin: border-box;
        background-repeat: no-repeat;
        background-clip: padding-box, border-box;
    `;
    case 'button': return `
        border: 1px solid transparent;
        background-image: 
          linear-gradient(101.18deg, ${rgba('#FFFFFF', 0.1)} 1.64%, ${rgba('#FFFFFF', 0.1)} 112.71%),
          linear-gradient(${param1 ?? '#222222'}, ${param1 ?? '#222222'}),
          linear-gradient(61.97deg, #FF4C3B -2.84%, #E40C5B 86.13%);
        background-origin: border-box;
        background-repeat: no-repeat;
        background-clip: padding-box, padding-box, border-box;
    `;
    case 'custom': return `
        border: 1px solid transparent;
        background-image: 
          linear-gradient(${param1 ?? '#222222'}, ${param1 ?? '#222222'}),
          ${params2 || ''};
        background-origin: border-box;
        background-repeat: no-repeat;
        background-clip: padding-box, border-box;

    `;
  }

  return '';
};
