import EmailList from '@/components/TransactionList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Budget Tracker</h1>
        <EmailList />
      </div>
    </main>
  );
}