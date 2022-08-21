import { Knex } from "knex";
import { SqliteError } from "../../infra/database/errors";
import { tableNames } from "../../infra/database/types";
import { ILogger } from "../../infra/logger/definitions";
import { BaseRepository } from "../common/BaseRepository";
import { ICurrency, ICurrencyRate } from "../types";

export class CurrencyRepo extends BaseRepository {

  constructor(db: Knex, logger: ILogger) {
    super(tableNames.currencies, db, logger);
  }

  public async create(data: ICurrency): Promise<ICurrency> {
    try {
      const [currency] = await this.db.table(this.tablename).insert(data, "*");
      return currency;
    } catch (err) {
      this.logger.error(err);
      this.logger.error(JSON.stringify(err));
      const error = err as SqliteError;
      throw err;
    }
  }

  public async list(): Promise<ICurrency[]> {
    return await this.db.table(this.tablename).select('*');
  }

  public async getByIsoCode(iso_code: string): Promise<ICurrency | null> {
    const found = await this.db.table(this.tablename).select("*")
      .where('currency_iso_code', iso_code)
      .first();
    if (!found) return null;
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
