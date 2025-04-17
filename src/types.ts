export interface BudgetData {
  income: number;
  rent: number;
  food: number;
  travel: number;
  savings: number;
  other: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}