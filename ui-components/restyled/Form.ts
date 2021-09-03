import { createGlobalStyle } from 'styled-components';

import { getThemeConfig, typography } from '../utils';

export const OverwriteFormStyle = createGlobalStyle`
.ant-form {
  color: ${getThemeConfig('primary', 'text')};
}

.ant-form-item-label > label {
  ${typography(16, 19, 500, 'gray4')};
}

.ant-form-vertical .ant-form-item-label {
  padding: 0 0 12px;
}

.ant-form-item-has-error .ant-select:not(.ant-select-borderless) .ant-select-selector {
  border: none !important;
  box-shadow: none !important;
}

.ant-form-item-has-error .ant-form-item-explain, .ant-form-item-has-error .ant-form-item-split {
  color: ${getThemeConfig('error2')} !important;
}

.ant-form-item {
  color: ${getThemeConfig('primary', 'text')};
}

.ant-input-number {
  width: 100%;
}

.ant-picker {
  min-width: 250px;
  height: 48px;
  border: 1px solid var(--input-border-color);
  border-radius: 8px;
  font-size: 24px;
  line-height: 29px;
  color: var(--text-color-primary);

  &:hover {
    border: 1px solid var(--input-border-color);
    box-shadow: 0 0 2px 2px var(--input-shadow);
  }

  &.ant-picker-focused {
    box-shadow: 0 0 2px 2px var(--input-shadow);
  }
}

.ant-radio-checked .ant-radio-inner {
  border-color: var(--color-primary);
}

.ant-radio-inner::after {
  background-color: var(--color-primary);
}

.ant-form-item-extra {
  margin-top: 4px;
  color: var(--text-color-second);
}

.aca-number-input {
  // disable all input default apperence
  border: none;
  box-shadow: none;
  outline: none;
  appearance: none;

  font-size: inherit;
  line-height: 1.208333;
  color: var(--text-color-primary);
  background: transparent;
  text-overflow: ellipsis;

  &::placeholder-shown {
    color: var(--text-color-second);
  }
}

.ant-form-item-has-error {
  .ant-select-selection-search-input
  , .aca-number-input
  , .ant-input-number {
    border: 1px solid var(--input-border-color-error);
    box-shadow: 0 0 2px 2px var(--input-shadow-error);
  }
}

.ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
  background-color: var(--information-bg);
}

.ant-input-group {
  & .ant-select {
    min-width: 96px;
  }

  & .ant-select-selector {
    display: flex;
    height: 100% !important;
    align-items: center;
    font-weight: 500;
    font-size: 24px;
    color: var(--text-color-normal);
  }

  &.ant-input-group-compact > *:first-child .ant-select-selector {
    border: 1px solid var(--input-border-color);
  }

  &.ant-input-group-compact > *:first-child .ant-select-selector {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
  }

  &.ant-input-group-compact > *:last-child {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
  }
}

.ant-input-number {
  height: 48px;
  border-radius: 8px;
  border: 1px solid var(--input-border-color);
  font-size: 24px;
  overflow: hidden;

  &.ant-input-number-focused, &:hover {
    border: 1px solid var(--input-border-color);
    box-shadow: 0 0 2px 2px var(--input-shadow);
  }

  & .ant-input-number-input-wrap {
    height: 100%;
  }

  & input {

    &::placeholder {
      color: var(--text-color-second);
    }

    height: 100%;
  }
}

.ant-select:not(.ant-select-customize-input) {
  &-focused .ant-select-selector {
    border: 1px solid var(--input-border-color);
    box-shadow: 0 0 2px 2px var(--input-shadow);
  }

  .ant-select-selector {
    height: 48px;
    border-radius: 8px;
    border: 1px solid var(--input-border-color);
    font-size: 18px;

    .ant-select-selection-item {
      line-height: 48px !important;
    }

    &:hover {
      border: 1px solid var(--input-border-color);
      box-shadow: 0 0 2px 2px var(--input-shadow);
    }
  }
}
`;
