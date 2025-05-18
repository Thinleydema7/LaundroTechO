// src/components/Feedback/FeedbackForm.js

'use client';

import { useState } from 'react';

const FeedbackForm = ({ userId }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setStatus('Feedback cannot be empty.');
      return;
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, userId }),
      });

      if (res.ok) {
        setContent('');
        setStatus('Feedback submitted successfully!');
      } else {
        const { error } = await res.json();
        setStatus(error || 'Failed to submit feedback.');
      }
    } catch (err) {
      console.error(err);
      setStatus('An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h3>Leave Feedback</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Your feedback..."
        rows={4}
        required
      />
      <button type="submit">Submit</button>
      {status && <p className="status">{status}</p>}

      <style jsx>{`
        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 500px;
          margin: 1rem auto;
        }

        textarea {
          resize: vertical;
          padding: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }

        button {
          padding: 0.6rem 1.2rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        button:hover {
          background-color: #0059c1;
        }

        .status {
          font-size: 0.95rem;
          color: #0070f3;
        }
      `}</style>
    </form>
  );
};

export default FeedbackForm;
