'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login with password:', password); // Add debug logging
    if (login(password)) {
      setError('');
    } else {
      setError('Invalid password');
      console.log('Expected password:', process.env.NEXT_PUBLIC_APP_PASSWORD); // Add debug logging
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Budget Tracker
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the password to access the application
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter password"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
