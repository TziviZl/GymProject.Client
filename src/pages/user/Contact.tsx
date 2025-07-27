import React, { useState, useEffect } from 'react';
import { sendContactMessage } from '../../api/contactApi';
import { ContactMessage } from '../../types';
import { useAuth } from '../../store/hooks';
import { storage } from '../../utils/storage';
import { getGymnastById } from '../../api/gymnastApi';
import '../../css/Contact.css';

export default function Contact() {
  const { userId, userType } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (userId && userType === 'gymnast') {
        try {
          const response = await getGymnastById(userId);
          const userData = response.data;
          setName(`${userData.firstName} ${userData.lastName}`);
          setEmail(userData.email);
        } catch (err) {
          console.error('Failed to load user data:', err);
        }
      }
    };

    loadUserData();
  }, [userId, userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // שמירה ב-localStorage בינתיים
      const messages = storage.getContactMessages();
      const newMessage: ContactMessage = {
        id: Date.now(),
        name,
        email,
        message,
        createdAt: new Date().toISOString()
      };
      messages.push(newMessage);
      storage.setContactMessages(messages);
      
      setSuccess('Thank you for contacting us! We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>

        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Your full name"
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="your.email@example.com"
            readOnly={!!userId}
            style={userId ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
          />
        </label>

        <label>
          Message:
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            placeholder="Write your message here..."
            rows={5}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}
