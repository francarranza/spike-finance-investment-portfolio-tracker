export interface IAccount {

  account_id: number | null | undefined;
  currency_iso_code: string;
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

export interface IBalanceUpdate {
  balance_update_id: number;
  account_id: number;
  new_balance: number;
  description: string | null;
  updated_at: Date;
}
