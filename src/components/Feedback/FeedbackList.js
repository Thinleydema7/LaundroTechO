// src/components/Feedback/FeedbackList.js

'use client';

import { useEffect, useState } from 'react';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch('/api/feedback');
        const data = await res.json();
        setFeedbacks(data);
      } catch (error) {
        console.error('Failed to load feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div className="feedback-list">
      <h3>User Feedback</h3>
      {feedbacks.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <ul>
          {feedbacks.map((fb) => (
            <li key={fb.id}>
              <p>{fb.content}</p>
              <small>By: {fb.user?.name || 'Anonymous'} | {new Date(fb.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .feedback-list {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          border-bottom: 1px solid #eee;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
        }

        p {
          margin: 0 0 0.4rem 0;
        }

        small {
          color: #666;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default FeedbackList;
