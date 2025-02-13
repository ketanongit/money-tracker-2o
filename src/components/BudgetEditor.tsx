'use client';

import { useState } from 'react';

interface BudgetEditorProps {
  currentBudget: number;
  onUpdate: (amount: number) => Promise<void>;
}

export default function BudgetEditor({ currentBudget, onUpdate }: BudgetEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(currentBudget.toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!isNaN(value) && value >= 0) {
      await onUpdate(value);
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <button 
        onClick={() => setIsEditing(true)}
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        Edit Budget
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="px-2 py-1 border text-black rounded w-32"
        step="100"
      />
      <button type="submit" className="px-2 py-1 bg-blue-600 text-white rounded text-sm">
        Save
      </button>
      <button 
        type="button" 
        onClick={() => {
          setIsEditing(false);
          setAmount(currentBudget.toString());
        }}
        className="px-2 py-1 bg-red-600 rounded text-sm"
      >
        Cancel
      </button>
    </form>
  );
}
