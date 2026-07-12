import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ChatReply() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [study, setStudy] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudy();
  }, [token]);

  const fetchStudy = async () => {
    try {
      const response = await axios.get(`/api/links/token/${token}`);
      setStudy(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid or expired link');
      navigate('/thank-you');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) {
      toast.error('Please write your response');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/api/replies', {
        linkId: study.linkId,
        content: reply.trim()
      });
      navigate('/thank-you');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="p-4 bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <div>
              <div className="font-semibold">MindSight Study</div>
              <div className="text-xs text-blue-100">Private & Anonymous</div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-gray-800">
              {study.message}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Response
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your honest thoughts..."
              disabled={submitting}
            />

            <div className="mt-3 text-xs text-gray-400">
              🔒 Your response is private and anonymous
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Sending...' : '✉️ Send Reply'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
