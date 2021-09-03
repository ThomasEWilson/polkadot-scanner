type FlexJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch';
type FlexDirection = 'column' | 'row';

export function flexBox (justify: FlexJustify, align: FlexAlign, direction: FlexDirection = 'row'): string {
  return `
    display: flex;
    flex-direction: ${direction};
    align-items: ${align};
    justify-content: ${justify};
  `;
}
