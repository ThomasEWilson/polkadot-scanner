import { Modal as AntModal } from 'antd';
import { rgba } from 'polished';
import React, { FC, ReactNode } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { Button } from '../Button';
import { BareProps } from '../types';
import { typography } from '../utils';

export const OverwriteModalStyle = createGlobalStyle`
  :root {
    --background: ${({ theme }) => theme.modal.background1};
  }
  
  .ant-modal-mask {
    background: ${({ theme }) => rgba(theme.modal.mask, 0.7)};
  }

  .ant-modal {
    padding-bottom: 0;
  }

  .ant-modal-content {
    border: 1px solid ${({ theme }) => theme.modal.border};
    border-radius: ${({ theme }) => theme.borderRadius}px;
    background: var(--background);
    color: ${({ theme }) => theme.text.primary};
  }

  .ant-modal-header {
    padding: 44px 40px 32px 40px;
    background: var(--background);
    border-bottom: 1px solid ${({ theme }) => theme.modal.divider};
    border-top-left-radius: ${({ theme }) => theme.borderRadius}px;
    border-top-right-radius: ${({ theme }) => theme.borderRadius}px;
  }

  .ant-modal-title {
    color: ${({ theme }) => theme.text.primary};
    ${typography(24, 29, 500)};
  }

  .ant-modal-body {
    padding: 24px 40px;
  }
`;

const CModal = styled(AntModal)`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 80%;
  width: 560px;
  outline: none;
`;

interface ActionProps extends BareProps {
  action?: ReactNode;
  confirmText?: string | null;
  cancelText?: string | null;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

const Action = styled<FC<ActionProps>>(({ action,
  cancelText,
  className,
  confirmText,
  onCancel,
  onConfirm,
  showCancel }) => {
  if (action === null) return null;

  if (action) {
    return (
      <div className={className}>{action}</div>
    );
  }

  return (
    <div className={className}>
      {showCancel
        ? (
          <Button
            onClick={onCancel}
            size='small'
          >
            {cancelText}
          </Button>
        )
        : null}
      {onConfirm
        ? (
          <Button
            onClick={onConfirm}
            size='small'
          >
            {confirmText}
          </Button>
        )
        : null}
    </div>
  );
})`
  margin-top: 32px;
  display: flex;
  justify-content: center;
  column-gap: 24px;

  & > button {
    margin-left: 16px;
  }

  & > button:first-child {
    margin-left: 0;
  }
`;

interface ModalProps extends BareProps {
  visible: boolean;
  title?: ReactNode;
  action?: ReactNode;
  closeable?: boolean;
  confirmText?: string | null;
  cancelText?: string | null;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  width?: number;
}

export const Modal: FC<ModalProps> = ({ action,
  cancelText = 'Close',
  children,
  className,
  closeable = true,
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
  showCancel = false,
  title,
  visible = true,
  width = 560 }) => {
  return (
    <CModal
      centered
      className={className}
      closable={closeable}
      closeIcon={<CloseIcon />}
      destroyOnClose
      footer={null}
      keyboard={true}
      maskClosable={false}
      onCancel={onCancel}
      title={title}
      visible={visible}
      width={width}
    >
      <div>{children}</div>
      <Action
        action={action}
        cancelText={cancelText}
        confirmText={confirmText}
        onCancel={onCancel}
        onConfirm={onConfirm}
        showCancel={showCancel}
      />
    </CModal>
  );
};
