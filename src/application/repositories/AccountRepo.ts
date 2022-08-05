import { Knex } from "knex";
import { IAccount } from "../types";
import { CurrencyRepo } from "./CurrencyRepo";

type AccountCreate = {
  name: string,
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

  public async create({ name, currency_iso_code, bank_name, starting_balance, description }: AccountCreate): Promise<IAccount> {
    if (currency_iso_code) {
      const found = this.currencyRepo.getByIsoCode(currency_iso_code);
      if (!found) throw new Error('[AccountRepo.create] iso_code not found');
    }

    const [account] = await this.db
      .table('accounts')
      .insert({ name, bank_name, starting_balance, currency_iso_code, description }, "*");

    return account;
  }

  public async list() {
    return await this.db.table('accounts').select('*');
  }

  public async getById(id: number): Promise<IAccount> {
    return await this.db.table('accounts')
      .select('*')
      .where('account_id', id)
      .first();
  }

}


