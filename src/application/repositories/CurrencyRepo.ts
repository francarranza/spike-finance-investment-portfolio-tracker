import { Knex } from "knex";
import { tableNames } from "../../infra/database/types";
import { Currency } from "../domain/Currency";
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

  public async getByIsoCode(iso_code: string): Promise<Currency | null> {
    const found = await this.db.table('currencies')
      .select("*").where('currency_iso_code', iso_code).first();
    if (!found) return null;
    return new Currency(found);
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

  public async getLatestRate({ base, quote }: { base: string, quote: string }) {
    const rate: ICurrencyRate = await this.db.table(tableNames.currencyRates)
      .select('*')
      .where('base', base)
      .where('quote', quote)
      .orderBy('close_at', 'desc')
      .first();

    return rate;
  }
}
