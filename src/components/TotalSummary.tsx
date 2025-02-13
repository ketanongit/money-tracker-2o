interface TotalSummaryProps {
  totalCredit: number;
  totalDebit: number;
}

export default function TotalSummary({ totalCredit, totalDebit }: TotalSummaryProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const netAmount = totalCredit - totalDebit;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-sm font-medium text-green-800">Total Credit</h3>
        <p className="text-2xl font-bold text-green-600">{formatAmount(totalCredit)}</p>
      </div>
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h3 className="text-sm font-medium text-red-800">Total Debit</h3>
        <p className="text-2xl font-bold text-red-600">{formatAmount(totalDebit)}</p>
      </div>
      <div className={`p-4 rounded-lg border ${netAmount >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <h3 className="text-sm font-medium text-gray-800">Net Balance</h3>
        <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
          {formatAmount(netAmount)}
        </p>
      </div>
    </div>
  );
}
