import { useState, useCallback } from 'react';

interface PopupState {
  visible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
}

export const usePopup = () => {
  const [popupState, setPopupState] = useState<PopupState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showPopup = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    options?: {
      confirmText?: string;
      onConfirm?: () => void;
      cancelText?: string;
    }
  ) => {
    setPopupState({
      visible: true,
      type,
      title,
      message,
      ...options,
    });
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    showPopup('success', title, message);
  }, [showPopup]);

  const showError = useCallback((title: string, message: string) => {
    showPopup('error', title, message);
  }, [showPopup]);

  const showWarning = useCallback((title: string, message: string) => {
    showPopup('warning', title, message);
  }, [showPopup]);

  const showInfo = useCallback((title: string, message: string) => {
    showPopup('info', title, message);
  }, [showPopup]);

  const showConfirm = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    showPopup('warning', title, message, {
      confirmText,
      onConfirm,
      cancelText,
    });
  }, [showPopup]);

  const hidePopup = useCallback(() => {
    setPopupState(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    popupState,
    showPopup,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    hidePopup,
  };
};
