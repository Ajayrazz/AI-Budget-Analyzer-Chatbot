import React from 'react';
import { BudgetData } from '../types';
import { DollarSign, PiggyBank, Home, Utensils, Plane, Wallet, MoreHorizontal, Brain } from 'lucide-react';

interface BudgetFormProps {
  budget: BudgetData;
  setBudget: (budget: BudgetData) => void;
  onAskAI: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ budget, setBudget, onAskAI }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBudget({ ...budget, [name]: parseFloat(value) || 0 });
  };

  const getIcon = (key: string) => {
    switch (key) {
      case 'income':
        return <Wallet className="h-5 w-5 text-green-500" />;
      case 'rent':
        return <Home className="h-5 w-5 text-blue-500" />;
      case 'food':
        return <Utensils className="h-5 w-5 text-orange-500" />;
      case 'travel':
        return <Plane className="h-5 w-5 text-purple-500" />;
      case 'savings':
        return <PiggyBank className="h-5 w-5 text-pink-500" />;
      default:
        return <MoreHorizontal className="h-5 w-5 text-gray-500" />;
    }
  };

  const totalExpenses = budget.rent + budget.food + budget.travel + budget.other;
  const remainingBudget = budget.income - totalExpenses - budget.savings;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Budget Details</h2>
      
      <div className="space-y-6">
        {Object.entries(budget).map(([key, value]) => (
          <div key={key} className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {key}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {getIcon(key)}
              </div>
              <input
                type="number"
                name={key}
                value={value || ''}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 group-hover:border-blue-300"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {budget.income > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Expenses:</span>
              <span className="font-medium text-gray-800">${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Savings:</span>
              <span className="font-medium text-gray-800">${budget.savings.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Remaining:</span>
                <span className={`font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${remainingBudget.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onAskAI}
        className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium shadow-sm hover:shadow-md"
      >
        <Brain className="h-5 w-5" />
        <span>Analyze My Budget</span>
      </button>
    </div>
  );
};

export default BudgetForm;