import deps, { IDependencies } from '../../infra/dependencies'
import { IAccount, ICurrency } from '../types';
import { Currency } from './Currency';

type inAccount = {
  account_id?: number | null,
  name: string,
  currency_iso_code: string,
  description?: string | null,
  bank_name?: string | null,
  starting_balance?: number,
}

export class Account {

  private deps: IDependencies;
  protected data: IAccount;
  protected currency: ICurrency | null = null;

  constructor(
    data: inAccount,
  ) {
    this.data = {
      ...data,
      account_id: data.account_id || null,
      description: data.description || null,
      bank_name: data.bank_name || null,
      starting_balance: data.starting_balance || 0,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.deps = deps;

    if (!data.currency_iso_code || !data.name) {
      throw new Error('Please check required values')
    }

  }

  public get info() {
    return this.data;
  }

  public checkIsPersisted() {
    if (!this.data.account_id) throw new Error(`Account ${this.data.name} is not persisted`);
    return true;
  }

  public async persist(): Promise<IAccount> {
    this.data = await this.deps.repositories.account.create(this.data);
    return this.data;;

  }

  public async list() {
    // TODO: Should be static but I need those dependencies
    const accounts: IAccount[] = await this.deps.db.table('accounts').select('*');
    return accounts;
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

  public async getBalance(currenct?: Currency) {
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

    const balance = this.data.starting_balance + totalDeposits - totalWithdrawal;
    return balance;
  }

  public async getStats() {

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

    console.info('Account All Information')
    console.info(this.data);

    console.info('List deposits');
    console.table(deposits);

    console.info('List withdrawals');
    console.table(withdrawals);

    const balance = this.data.starting_balance + totalDeposits - totalWithdrawal;
    console.info(`Current balance is ${balance} ${this.data.currency_iso_code}`)
  }

}
