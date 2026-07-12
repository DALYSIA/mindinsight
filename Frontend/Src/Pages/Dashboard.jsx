import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudies();
  }, []);

  const fetchStudies = async () => {
    try {
      const response = await axios.get('/api/studies');
      setStudies(response.data);
    } catch (error) {
      toast.error('Failed to load studies');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <h1 className="text-xl font-bold text-gray-800">MindSight Studio</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">👤 {admin?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Studies</h2>
          <button
            onClick={() => navigate('/create-study')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>+</span> Create New Study
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : studies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">No studies created yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "Create New Study" to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {studies.map((study) => (
              <div
                key={study.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/study/${study.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{study.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Created {new Date(study.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{study.sentCount || 0}</div>
                      <div className="text-gray-400 text-xs">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">{study.replyCount || 0}</div>
                      <div className="text-gray-400 text-xs">Replies</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-600">
                        {study.sentCount > 0 ? Math.round((study.replyCount / study.sentCount) * 100) : 0}%
                      </div>
                      <div className="text-gray-400 text-xs">Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
