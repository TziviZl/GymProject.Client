import React from 'react';
import '../../css/ToastMessage.css';

interface Props {
  message: string;
  type: 'success' | 'error';
}

export default function ToastMessage({ message, type }: Props) {
  return <div className={`toast-message ${type}`}>{message}</div>;
}
