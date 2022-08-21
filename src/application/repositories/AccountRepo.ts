import { Knex } from "knex";
import { NotFound } from "../../infra/database/errors";
import { tableNames } from "../../infra/database/types";
import { ILogger } from "../../infra/logger/definitions";
import { BaseRepository } from "../common/BaseRepository";
import { IAccount, IBalanceUpdate } from "../types";
import { CurrencyRepo } from "./CurrencyRepo";

type AccountCreate = {
  name: string,
  profile_id: number,
  currency_iso_code: string,
  bank_name: string | null,
  starting_balance: number,
  description?: string | null,
}

export class AccountRepo extends BaseRepository {

  protected currencyRepo: CurrencyRepo;

  constructor(db: Knex, logger: ILogger, currencyRepo: CurrencyRepo) {
    super(tableNames.accounts, db, logger)
    this.currencyRepo = currencyRepo;
  }

  public async create({
    profile_id,
    name,
    currency_iso_code,
    bank_name,
    starting_balance,
    description
  }: AccountCreate): Promise<IAccount> {
    const found = this.currencyRepo.getByIsoCode(currency_iso_code);
    if (!found) {
      this.logger.debug(`[AccountRepo.create] Attempted to create account with currency iso "${currency_iso_code}"`);
      throw new NotFound('Currency not found');
    }

    const [account] = await this.db
      .table(tableNames.accounts)
      .insert({ profile_id, name, bank_name, starting_balance, currency_iso_code, description }, "*");

    return account;
  }

  public async list(): Promise<IAccount[]> {
    return await this.db.table(tableNames.accounts).select('*');
  }

  public async listByProfile(profile_id: number): Promise<IAccount[]> {
    const accounts: IAccount[] = await this.db.table(tableNames.accounts)
      .select('*')
      .where('profile_id', profile_id)
      .orderBy('bank_name', 'asc');

    return accounts;
  }

  public async getById(id: number): Promise<IAccount> {
    return await this.db.table(tableNames.accounts)
      .select('*')
      .where('account_id', id)
      .first();
  }

  public async getByName(name: string): Promise<IAccount> {
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
    new_balance: number,
    description?: string | null,
    updated_at?: Date
  }): Promise<IBalanceUpdate> {
    const [created] = await this.db
      .table('balance_updates')
      .insert({ account_id, new_balance, description, updated_at }, "*");
    return created;
  }

}


