import React from 'react';
import { Link } from 'react-router-dom';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h1>
        <p className="text-gray-600 mb-4">
          Your response has been recorded.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          ✨ You're helping us understand the mindset of entrepreneurs.
        </p>
        <div className="text-xs text-gray-400">
          This link has expired for security
        </div>
        <Link
          to="/"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          ← Return to Home
        </Link>
      </div>
    </div>
  );
}
