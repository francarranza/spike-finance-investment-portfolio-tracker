import deps, { IDependencies } from '../../infra/dependencies'
import { IAccount } from '../types';
import { Currency } from './Currency';

export type inAccount = {
  account_id?: number | null,
  profile_id: number,
  name: string,
  description?: string | null,
  bank_name?: string | null,
  starting_balance?: number,
}

export class Account {

  private deps: IDependencies;
  public data: IAccount;
  protected currency: Currency;

  constructor(
    data: inAccount,
    currency: Currency
  ) {
    this.data = {
      ...data,
      account_id: data.account_id || null,
      description: data.description || null,
      bank_name: data.bank_name || null,
      currency_iso_code: currency.data.currency_iso_code,
      starting_balance: data.starting_balance || 0,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.currency = currency;
    this.deps = deps;

    if (!currency.data.currency_iso_code || !data.name) {
      throw new Error('Please check required values')
    }

  }

  public async persist(): Promise<IAccount> {
    this.data = await this.deps.repositories.account.create(this.data);
    return this.data;;
  }

  public async updateBalance({
    new_balance,
    description = null,
    updated_at = new Date(),
  }: {
    new_balance: number,
    description?: string | null,
    updated_at?: Date
  }) {
    if (!this.data.account_id) throw new Error('Account is not persisted');
    return await this.deps.repositories.account.createBalanceUpdate({
      account_id: this.data.account_id,
      new_balance,
      description,
      updated_at
    });
  }

  public async transferMoney({
    to_account,
    amount,
    open_at,
    description = null,
    fees = 0
  }: {
    to_account: Account,
    amount: number,
    open_at: Date,
    description?: string | null;
    fees?: number;
  }) {
    if (!this.data.account_id) throw new Error('Account is not persisted');
    if (!to_account.data.account_id) throw new Error('to_account is not persisted');

    const transfer = await this.deps.repositories.accountActivity.create({
      account_withdrawal_id: this.data.account_id,
      account_deposit_id: to_account.data.account_id,
      amount_withdrawal: -amount,
      amount_deposit: amount,
      fees,
      description,
      open_at,
    });

    return transfer;
  }

  public async getBalance(currency: Currency = this.currency) {
    if (!this.data.account_id) throw new Error('Account is not persisted');

    const [
      deposits,
      withdrawals
    ] = await Promise.all([
      this.deps.repositories.accountActivity.listDeposits(this.data.account_id),
      this.deps.repositories.accountActivity.listWithdrawals(this.data.account_id),
    ]);


    const totalDeposits = deposits.reduce((prev, curr) => {
      return prev + curr.amount_deposit;
    }, 0);

    const totalWithdrawal = withdrawals.reduce((prev, curr) => {
      return prev + curr.amount_deposit;
    }, 0);

    const balanceOurCurrency = this.data.starting_balance + totalDeposits - totalWithdrawal;

    const base = this.currency.data.currency_iso_code;
    const quote = currency.data.currency_iso_code;
    if (base === quote) {
      return balanceOurCurrency;
    }
    else {
      const latestRate = await this.deps.repositories.currency.getLatestRate({
        base, quote,
      });

      if (!latestRate) throw new Error(`No rate was found for pair ${base}:${quote}`);
      return balanceOurCurrency * latestRate.value;
    }

  }

  public async getStats(currency?: Currency) {

    if (!this.data.account_id) throw new Error('Account is not persisted');
    const selectedCurrency = currency || this.currency;

    const [
      deposits,
      withdrawals
    ] = await Promise.all([
      this.deps.repositories.accountActivity.listDeposits(this.data.account_id),
      this.deps.repositories.accountActivity.listWithdrawals(this.data.account_id),
    ]);

    console.info(`--- ${this.data.name} Account Stats ---`)
    console.info(this.data);

    console.info('List deposits');
    console.table(deposits);

    console.info('List withdrawals');
    console.table(withdrawals);

    const balance = await this.getBalance(currency)
    console.info(`Current balance is ${balance} ${selectedCurrency.data.currency_iso_code}`)
  }

}
