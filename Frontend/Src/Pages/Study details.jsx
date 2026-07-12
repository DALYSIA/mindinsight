import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function StudyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudy();
  }, [id]);

  const fetchStudy = async () => {
    try {
      const response = await axios.get(`/api/studies/${id}`);
      setStudy(response.data);
    } catch (error) {
      toast.error('Failed to load study');
      navigate('/');
    }
    setLoading(false);
  };

  const markAsSent = async (linkId) => {
    try {
      await axios.patch(`/api/studies/${id}/links/${linkId}/sent`);
      toast.success('Marked as sent');
      fetchStudy();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const copyLink = (token) => {
    const url = `${window.location.origin}/reply/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!study) return <div className="text-center py-12">Study not found</div>;

  const sentCount = study.links.filter(l => l.sentAt).length;
  const replyCount = study.replies.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-800 mb-4"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{study.title}</h1>
          <p className="text-gray-600 mt-2">{study.message}</p>
          
          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <span className="text-gray-500">Sent:</span>
              <span className="font-bold ml-1">{sentCount}</span>
            </div>
            <div>
              <span className="text-gray-500">Replies:</span>
              <span className="font-bold ml-1">{replyCount}</span>
            </div>
            <div>
              <span className="text-gray-500">Rate:</span>
              <span className="font-bold ml-1">
                {sentCount > 0 ? Math.round((replyCount / sentCount) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 Links for WhatsApp</h2>
          
          <div className="space-y-3">
            {study.links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{link.contactName || 'Unnamed'}</div>
                  <div className="text-xs text-gray-400">{link.contactPhone}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyLink(link.token)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Copy Link
                  </button>
                  {!link.sentAt && (
                    <button
                      onClick={() => markAsSent(link.id)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Mark Sent
                    </button>
                  )}
                  {link.sentAt && (
                    <span className="px-3 py-1 text-sm text-gray-500">
                      ✅ Sent {new Date(link.sentAt).toLocaleDateString()}
                    </span>
                  )}
                  {link.isUsed && (
                    <span className="px-3 py-1 text-sm text-purple-600 bg-purple-50 rounded">
                      Replied
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {study.replies.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">💬 Replies</h2>
            <div className="space-y-4">
              {study.replies.map((reply) => (
                <div key={reply.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>🔒 {reply.link?.contactName || 'Anonymous'}</span>
                    <span>{new Date(reply.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700">{reply.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
