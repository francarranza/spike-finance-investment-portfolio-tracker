export interface IProfile {
  profile_id: number | null | undefined;
  preferred_currency: string;
  firstname: string;
  lastname: string | null;
  email: string | null;
  created_at: Date;
  updated_at: Date;

  currency?: ICurrency;
}

export interface IAccount {
  account_id: number | null;
  currency_iso_code: string;
  profile_id: number;
  name: string;
  description: string | null;
  bank_name: string | null;
  starting_balance: number;
  created_at: Date;
  updated_at: Date;
}

export interface ICurrency {
  currency_iso_code: string;
  name: string;
  symbol: string;
}

export interface ICurrencyRate {
  currency_rate_id: number | null | undefined;
  base: number;
  quote: number;
  type: string | null;
  value: number;
  close_at: Date;
}

export interface IBalanceUpdate {
  balance_update_id: number;
  account_id: number;
  new_balance: number;
  description: string | null;
  updated_at: Date;
}

export interface IAccountActivity {
  activity_id: number | null | undefined;
  account_withdrawal_id: number;
  account_deposit_id: number;
  amount_withdrawal: number;
  amount_deposit: number;
  description: string | null;
  fees: number | null;
  open_at: Date;
  created_at: Date;
}

export interface ITransaction {
  transaction_id: number | null | undefined;
  account_id: number;
  category: string;
  description: string | null;
  amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface ITransactionCategory {
  name: string;
  description: string | null;
}
