import { Knex } from "knex";
import { tableNames } from "../../infra/database/types";
import { Account } from "../domain/Account";
import { IAccount, IAccountPersisted, IBalanceUpdate } from "../types";
import { CurrencyRepo } from "./CurrencyRepo";

type AccountCreate = {
  name: string,
  profile_id: number,
  currency_iso_code: string,
  bank_name: string | null,
  starting_balance: number,
  description?: string | null,
}

export class AccountRepo {

  private db: Knex;
  private currencyRepo: CurrencyRepo;

  constructor(db: Knex, currencyRepo: CurrencyRepo) {
    this.db = db;
    this.currencyRepo = currencyRepo;
  }

  public async create({ profile_id, name, currency_iso_code, bank_name, starting_balance, description }: AccountCreate): Promise<IAccount> {
    if (currency_iso_code) {
      const found = this.currencyRepo.getByIsoCode(currency_iso_code);
      if (!found) throw new Error('[AccountRepo.create] iso_code not found');
    }

    const [account] = await this.db
      .table(tableNames.accounts)
      .insert({ profile_id, name, bank_name, starting_balance, currency_iso_code, description }, "*");

    return account;
  }

  public async list() {
    return await this.db.table(tableNames.accounts).select('*');
  }

  public async listByProfile(profile_id: number): Promise<Account[]> {
    const accountsDb: IAccount[] = await this.db.table(tableNames.accounts)
      .select('*')
      .where('profile_id', profile_id)
      .orderBy('bank_name', 'asc');

    const proms = accountsDb.map(async (acc) => {
      const currDb = await this.currencyRepo.getByIsoCode(acc.currency_iso_code)
      if(!currDb) throw new Error('Currency not found')
      return new Account(acc, currDb)
    });
    return await Promise.all(proms);
  }

  public async getById(id: number): Promise<IAccount | null> {
    return await this.db.table(tableNames.accounts)
      .select('*')
      .where('account_id', id)
      .first();
  }

  public async getByName(name: string): Promise<IAccountPersisted | null> {
    return await this.db.table(tableNames.accounts)
      .select('*')
      .where('name', name)
      .first();
  }

  public async listBalanceUpdates(account_id: number): Promise<IBalanceUpdate[]> {
    return await this.db.table(tableNames.balanceUpdates)
      .select('*')
      .where('account_id', account_id)
      .orderBy('updated_at', 'desc');
  }

  public async getLastBalanceUpdate(account_id: number): Promise<IBalanceUpdate> {
    return await this.db.table(tableNames.balanceUpdates)
      .select('*')
      .where('account_id', account_id)
      .orderBy('updated_at', 'desc')
      .first();
  }

  public async createBalanceUpdate({
    account_id,
    new_balance,
    description = null,
    updated_at = new Date(),
  }: {
    account_id: number,
    new_balance: number | null,
    description?: string | null,
    updated_at?: Date | null
  }): Promise<IBalanceUpdate> {
    const [created] = await this.db
      .table('balance_updates')
      .insert({ account_id, new_balance, description, updated_at }, "*");
    return created;
  }

}


