import { Knex } from "knex";
import { tableNames } from "../../infra/database/types";
import { ICurrency, ICurrencyRate } from "../types";

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

  public async insertNewRate({
    base,
    quote,
    type = null,
    value,
    close_at
  }: {
    base: string,
    quote: string,
    type?: string | null,
    value: number,
    close_at: Date,
  }): Promise<ICurrencyRate> {
    const [rate] = await this.db.table(tableNames.currencyRates)
      .insert({ base, quote, type, value, close_at }, "*");
    return rate;
  }
}
