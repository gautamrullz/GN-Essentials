export interface DailySale {
  id: string;
  sale_date: string;
  cash_amount: number;
  online_amount: number;
  other_amount: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDailySaleInput {
  sale_date: string;
  cash_amount: number;
  online_amount: number;
  other_amount: number;
  notes?: string;
}

export interface UpdateDailySaleInput {
  sale_date?: string;
  cash_amount?: number;
  online_amount?: number;
  other_amount?: number;
  notes?: string;
}

export interface MonthlySalesSummary {
  total_sales: number;
  total_cash: number;
  total_online: number;
  total_other: number;
  days_recorded: number;
}