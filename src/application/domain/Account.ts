import { IDependencies } from '../../infra/dependencies'
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
    deps: IDependencies
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
    const accounts: IAccount[] = await this.deps.db.table('accounts').select('*');
    return accounts;
  }

  public async updateBalance() { }

}

export class AccountMovement {

  constructor() { }

}
