import { useEffect } from 'react';
import BudgetEditor from './BudgetEditor';
import { checkBudgetAlerts } from '@/lib/budgetAlerts';

interface TotalSummaryProps {
  totalCredit: number;
  totalDebit: number;
  budget: number;
  onBudgetUpdate: (amount: number) => Promise<void>;
}

export default function TotalSummary({ 
  totalCredit, 
  totalDebit, 
  budget,
  onBudgetUpdate 
}: TotalSummaryProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const netAmount = totalCredit - totalDebit;
  const remainingBudget = budget + netAmount;

  useEffect(() => {
    if (remainingBudget > 0) {
      checkBudgetAlerts(remainingBudget);
    }
  }, [remainingBudget]);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-600">Monthly Budget: {formatAmount(budget)}</h3>
        <BudgetEditor currentBudget={budget} onUpdate={onBudgetUpdate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-800">Budget Remaining</h3>
          <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
            {formatAmount(remainingBudget)}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800">Total Credit</h3>
          <p className="text-2xl font-bold text-green-600">{formatAmount(totalCredit)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-sm font-medium text-red-800">Total Debit</h3>
          <p className="text-2xl font-bold text-red-600">{formatAmount(totalDebit)}</p>
        </div>
        <div className={`p-4 rounded-lg border ${netAmount >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <h3 className="text-sm font-medium text-gray-800">Net amount</h3>
          <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
            {formatAmount(netAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}
