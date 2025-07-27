import React, { useState } from 'react';
import { ContactMessage } from '../../types';
import { useMessages, useDeleteMessage } from '../../hooks/useMessages';
import ToastMessage from '../../components/shared/ToastMessage';
import '../../css/SecretaryMessages.css';

export default function SecretaryMessages() {
  const { data: messages = [], isLoading: loading, error } = useMessages();
  const deleteMessageMutation = useDeleteMessage();
  const [toastMessage, setToastMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);



  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setMessageType(type);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDeleteYes = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteMessageMutation.mutateAsync(confirmDeleteId);
      showMessage('Message deleted successfully', 'success');
    } catch (err) {
      showMessage('Failed to delete message', 'error');
      console.error(err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const confirmDeleteNo = () => {
    setConfirmDeleteId(null);
  };

  if (loading) return <div className="contact-container">Loading messages...</div>;
  if (error) return <div className="contact-container error">Failed to load messages</div>;

  return (
    <div className="contact-container">
      <h1>Contact Messages</h1>
      
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div className="message-card" key={message.id}>
              <div className="message-main">
                <div className="message-header">
                  <strong>{message.name}</strong>
                  <span className="message-email">{message.email}</span>
                  {message.createdAt && (
                    <span className="message-date">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="message-content">
                  {message.message}
                </div>
              </div>
              <span 
                className="delete-btn" 
                onClick={() => handleDelete(message.id!)}
              >
                🗑️ DELETE
              </span>
            </div>
          ))}
        </div>
      )}

      {toastMessage && <ToastMessage message={toastMessage} type={messageType} />}

      {confirmDeleteId && (
        <div className="confirm-delete-toast">
          <p>Are you sure you want to delete this message?</p>
          <button onClick={confirmDeleteYes}>Yes</button>
          <button onClick={confirmDeleteNo}>No</button>
        </div>
      )}
    </div>
  );
}