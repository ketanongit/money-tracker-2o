import { EmailMessage } from '@/lib/email';
import { parseHDFCTransaction } from '@/lib/emailParser';

interface EmailItemProps {
  email: EmailMessage;
}

export default function EmailItem({ email }: EmailItemProps) {
  const transaction = email.html ? parseHDFCTransaction(email.html) : null;
  
  const borderColor = transaction
    ? transaction.type === 'CREDIT'
      ? 'border-green-500'
      : 'border-red-500'
    : 'border-gray-500';

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border-l-4 ${borderColor}`}>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-semibold text-gray-900">{email.subject}</h2>
        <span className="text-sm text-gray-500">
          {new Date(email.date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      
      {transaction && (
        <div className="mb-4 p-2 bg-gray-50 rounded">
          <p className={`font-medium ${
            transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.type}: ₹{transaction.amount.toLocaleString('en-IN')}
          </p>
          {transaction.recipient && (
            <p className="text-sm text-gray-600">
              {transaction.type === 'CREDIT' ? 'From: ' : 'To: '}{transaction.recipient}
            </p>
          )}
        </div>
      )}
    </div>
  );
}