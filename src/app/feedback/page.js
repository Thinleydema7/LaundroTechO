'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function FeedbackPage() {
  const { data: session, status } = useSession();
  const [content, setContent] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      setFeedbackList(data);
    } catch (err) {
      console.error('Error loading feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setContent('');
        fetchFeedbacks();
      } else {
        console.error('Failed to submit feedback');
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (status === 'loading') return <p>Loading session...</p>;
  if (!session) return <p>Please sign in to leave feedback.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Feedback</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience or suggestions..."
          className="w-full p-3 border rounded"
          rows={4}
          required
        ></textarea>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Previous Feedback</h2>
      {loading ? (
        <p>Loading feedback...</p>
      ) : feedbackList.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {feedbackList.map((fb) => (
            <li key={fb.id} className="border p-4 rounded shadow">
              <p>{fb.content}</p>
              <small className="text-gray-500">
                — {fb.user?.name || 'Anonymous'}, {new Date(fb.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
