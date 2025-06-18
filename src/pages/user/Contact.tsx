import React, { useState } from 'react';
import '../../css/Contact.css';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setTimeout(() => {
      setSuccess('Thank you for contacting us! We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    }, 500);
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

        <button type="submit">Send Message</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}
