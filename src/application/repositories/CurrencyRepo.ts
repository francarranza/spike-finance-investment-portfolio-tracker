import { Knex } from "knex";
import { ICurrency } from "../types";

export class CurrencyRepo {

  private db: Knex;
  constructor(db: Knex) {
    this.db = db;
  }

  public async create(data: ICurrency): Promise<ICurrency> {
    const [currency] = await this.db.table('currencies').insert(data, "*");
    return currency;
  }

  public async list(): Promise<ICurrency[]> {
    return await this.db.table('currencies').select('*');
  }

  public async getByIsoCode(iso_code: string) {
    const found = await this.db.table('currencies')
      .select("*").where('currency_iso_code', iso_code).first();
    return found;
  }
}
