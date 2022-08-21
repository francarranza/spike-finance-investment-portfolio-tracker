import { Knex } from "knex";
import { tableNames } from "../../infra/database/types";
import { ILogger } from "../../infra/logger/definitions";
import { BaseRepository } from "../common/BaseRepository";
import { NotFound, SqliteError } from "../../infra/database/errors";
import { ICurrency, IProfile } from "../types";

export class ProfileRepo extends BaseRepository {

  constructor(db: Knex, logger: ILogger) {
    super(tableNames.profiles, db, logger);
  }

  public async create(data: IProfile): Promise<IProfile> {
    try {
      const [inserted] = await this.db.table(this.tablename).insert(data, "*");
      return inserted;
    } catch (err: unknown) {
      const error = err as SqliteError
      this.logger.warn(`[ProfileRepo.create] Tried to insert with currency "${data.currency}" which doesnt exists`)
      this.logger.warn(`[ProfileRepo.create] Error code: ${error.code}`)
      throw new NotFound('Currency not found');
    }
  }

  public async getById(profile_id: number): Promise<IProfile | null> {
    const found = await this.db.table<IProfile>(tableNames.profiles)
      .select("*")
      .where('profile_id', profile_id)
      .first();
    if (!found) return null;

    const currency = await this.db.table<ICurrency>('currencies')
      .select("*")
      .where('currency_iso_code', found.preferred_currency)
      .first();

    if (!currency) {
      throw new NotFound('Currency must exist')
    }

    return {
      ...found,
      currency,
    }
  }

}
