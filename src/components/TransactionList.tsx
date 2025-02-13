'use client';

import { useEffect, useState } from 'react';
import { EmailMessage } from '@/lib/email';
import { formatMonthYear } from '@/lib/dateUtils';
import EmailItem from './TransactionItem';
import TotalSummary from './TotalSummary';
import { parseHDFCTransaction } from '@/lib/emailParser';

export default function EmailList() {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(formatMonthYear(new Date()));

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) throw new Error('Failed to fetch emails');
        const data = await response.json();
        setEmails(data);
        
        // Calculate totals
        let creditSum = 0;
        let debitSum = 0;
        
        data.forEach((email: EmailMessage) => {
          if (email.html) {
            const transaction = parseHDFCTransaction(email.html);
            if (transaction) {
              if (transaction.type === 'CREDIT') {
                creditSum += transaction.amount;
              } else {
                debitSum += transaction.amount;
              }
            }
          }
        });
        
        setTotalCredit(creditSum);
        setTotalDebit(debitSum);
        
        if (data.length === 0) {
          setError('No HDFC Bank alert emails found in your inbox');
        }
        setCurrentMonth(formatMonthYear(new Date()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();

    // Set up automatic refresh at the start of each month
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const timeUntilNextMonth = nextMonth.getTime() - now.getTime();

    const refreshTimer = setTimeout(() => {
      fetchEmails();
    }, timeUntilNextMonth);

    return () => clearTimeout(refreshTimer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Fetching HDFC Bank alerts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Transactions for {currentMonth}
      </h2>
      {emails.length > 0 && <TotalSummary totalCredit={totalCredit} totalDebit={totalDebit} />}
      <div className="space-y-4">
        {emails.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Found {emails.length} email{emails.length === 1 ? '' : 's'} from HDFC Bank
            </p>
            {emails.map((email) => (
              <EmailItem key={email.id} email={email} />
            ))}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No HDFC Bank alerts found</p>
          </div>
        )}
      </div>
    </div>
  );
}