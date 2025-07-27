import { useState } from 'react';

export const useErrorHandler = () => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleError = (error: any): string => {
    const errorMessage = 
      error?.response?.data?.Message || 
      error?.response?.data?.message || 
      error?.response?.data || 
      error?.message ||
      'An error occurred';
    
    return typeof errorMessage === 'string' ? errorMessage : 'An error occurred';
  };

  const showError = (error: any) => {
    const errorMessage = handleError(error);
    showMessage(errorMessage, 'error');
  };

  const showSuccess = (msg: string) => {
    showMessage(msg, 'success');
  };

  return {
    message,
    messageType,
    showMessage,
    showError,
    showSuccess,
    handleError
  };
};