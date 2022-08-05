import deps, { IDependencies } from '../../infra/dependencies'
import { IAccount, ICurrency } from '../types';

type inAccount = {
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
      account_id: null,
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

  public async persist(): Promise<IAccount> {
    this.data = await this.deps.repositories.account.create(this.data);
    return this.data;;

  }

  public async list() {
    // TODO: Should be static but I need those dependencies
    const accounts: IAccount[] = await this.deps.db.table('accounts').select('*');
    return accounts;
  }

  public async getBalance() {
    if (!this.data.account_id) throw new Error('Account is not persisted');
    const latest = await this.deps.repositories.account
      .getLastBalanceUpdate(this.data.account_id);

    if (latest) {
      return latest.new_balance;
    } else {
      return this.data.starting_balance;
    }
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

}

export class AccountMovement {

  constructor() { }

}
