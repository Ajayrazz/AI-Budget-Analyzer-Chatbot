import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import BudgetForm from './components/BudgetForm';
import ChatBox from './components/ChatBox';
import { BudgetData, ChatMessage } from './types';
import { Brain, Wallet } from 'lucide-react';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [budget, setBudget] = useState<BudgetData>({
    income: 0,
    rent: 0,
    food: 0,
    travel: 0,
    savings: 0,
    other: 0,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your financial assistant. I can help you plan your budget and provide financial advice. Start by entering your budget details on the left, or ask me a question!',
    },
  ]);

  const analyzeBudget = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const prompt = `
        As a financial advisor, analyze this budget and provide specific advice:
        Monthly Income: $${budget.income}
        Rent: $${budget.rent}
        Food: $${budget.food}
        Travel: $${budget.travel}
        Savings: $${budget.savings}
        Other Expenses: $${budget.other}

        Please provide:
        1. Analysis of spending ratios
        2. Specific recommendations for optimization
        3. Savings potential
        4. Any red flags or concerns
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, 
        { role: 'user', content: 'Please analyze my budget.' },
        { role: 'assistant', content: text }
      ]);
    } catch (error) {
      console.error('Error analyzing budget:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while analyzing your budget. Please make sure you have set up your Gemini API key correctly.',
      }]);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      setMessages(prev => [...prev, { role: 'user', content: message }]);

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `
        As a financial advisor, respond to this question: "${message}"
        
        Current budget context:
        Monthly Income: $${budget.income}
        Rent: $${budget.rent}
        Food: $${budget.food}
        Travel: $${budget.travel}
        Savings: $${budget.savings}
        Other Expenses: $${budget.other}

        Provide specific, actionable advice based on the question and budget information.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your message. Please make sure you have set up your Gemini API key correctly.',
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Wallet className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            Smart Budget Planner
          </h1>
          <Brain className="h-8 w-8 text-blue-600" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-8rem)]">
            <BudgetForm
              budget={budget}
              setBudget={setBudget}
              onAskAI={analyzeBudget}
            />
          </div>
          
          <div className="h-[calc(100vh-8rem)]">
            <ChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;