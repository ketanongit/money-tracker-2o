'use client';

import EmailList from '@/components/TransactionList';
import Login from '@/components/Login';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Budget Tracker</h1>
          <button 
            onClick={logout}
            className="px-4 py-2 text-sm hover:text-gray-200 bg-red-600 rounded-md text-white"
          >
            Logout
          </button>
        </div>
        <EmailList />
      </div>
    </main>
  );
}