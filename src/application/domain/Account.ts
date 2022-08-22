import deps from '../../infra/dependencies'
import { BaseDomain } from '../common/BaseDomain';
import { DomainError } from '../common/errors/DomainError';
import { IAccount } from '../types';
import { Currency } from './Currency';
import { Transaction } from './Transaction';

export type CreateAccount = {
  account_id: number | null,
  profile_id: number,
  name: string,
  description?: string | null,
  bank_name?: string | null,
  starting_balance?: number,
}

export class AccountError extends DomainError {}

export class Account extends BaseDomain {

  public _data: IAccount;
  protected currency: Currency;
  protected transactions: Transaction[] = [];

  constructor(
    data: CreateAccount,
    currency: Currency
  ) {
    super(deps);
    this.currency = currency;
    this._data = {
      account_id: data.account_id || null,
      profile_id: data.profile_id,
      name: data.name,
      description: data.description || null,
      bank_name: data.bank_name || null,
      currency_iso_code: currency._data.currency_iso_code,
      starting_balance: data.starting_balance || 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (!currency._data.currency_iso_code || !data.name) {
      throw new AccountError('Please check required values')
    }

  }

  get data() {
    return this._data;
  }

  public async persist(): Promise<IAccount> {
    this._data = await this.deps.repositories.account.create(this._data);
    this.markAsCreated();
    return this._data;
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
    if (!this._data.account_id) throw new Error('Account is not persisted');
    return await this.deps.repositories.account.createBalanceUpdate({
      account_id: this._data.account_id,
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
    if (!this._data.account_id) throw new Error('Account is not persisted');
    if (!to_account._data.account_id) throw new Error('to_account is not persisted');

    const transfer = await this.deps.repositories.accountActivity.create({
      account_withdrawal_id: this._data.account_id,
      account_deposit_id: to_account._data.account_id,
      amount_withdrawal: -amount,
      amount_deposit: amount,
      fees,
      description,
      open_at,
    });

    return transfer;
  }

  public async getBalance(currency: Currency = this.currency) {
    if (!this._data.account_id) throw new Error('Account is not persisted');

    const [
      deposits,
      withdrawals,
      transactions,
    ] = await Promise.all([
      this.deps.repositories.accountActivity.listDeposits(this._data.account_id),
      this.deps.repositories.accountActivity.listWithdrawals(this._data.account_id),
      this.deps.repositories.transaction.list(this._data.account_id),
    ]);


    const totalDeposits = deposits.reduce((prev, curr) => prev + curr.amount_deposit, 0);
    const totalWithdrawal = withdrawals.reduce((prev, curr) => prev + curr.amount_deposit, 0);
    const totalTransactions = transactions.reduce((prev, curr) => prev + curr.amount, 0);

    const balanceOurCurrency = this._data.starting_balance 
      + totalDeposits 
      - totalWithdrawal
      + totalTransactions;

    const base = this.currency._data.currency_iso_code;
    const quote = currency._data.currency_iso_code;
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

    if (!this._data.account_id) throw new Error('Account is not persisted');
    const selectedCurrency = currency || this.currency;

    const [
      deposits,
      withdrawals
    ] = await Promise.all([
      this.deps.repositories.accountActivity.listDeposits(this._data.account_id),
      this.deps.repositories.accountActivity.listWithdrawals(this._data.account_id),
    ]);

    console.info(`--- ${this._data.name} Account Stats ---`)
    console.info(this._data);

    console.info('List deposits');
    console.table(deposits);

    console.info('List withdrawals');
    console.table(withdrawals);

    const balance = await this.getBalance(currency)
    console.info(`Current balance is ${balance} ${selectedCurrency._data.currency_iso_code}`)
  }

  public async addTransaction({
    amount,
    category,
    description = null,
    created_at = null,
  }: {
    amount: number,
    category: string,
    description?: string | null,
    created_at?: Date | null,
  }) {

    if (!this._data.account_id) {
      throw new AccountError('Must persist account before adding a transaction');
    }

    const transaction = new Transaction({ 
      account_id: this._data.account_id,
      amount, 
      category, 
      description, 
      created_at, 
    }, this.deps);

    await transaction.persist();
    this.transactions.push(transaction);

    return transaction;
  }

}
