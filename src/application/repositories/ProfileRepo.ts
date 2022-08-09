import { Knex } from "knex";
import { tableNames } from "../../infra/database/types";
import { Currency } from "../domain/Currency";
import { Profile } from "../domain/Profile";
import { ICurrency, IProfile } from "../types";

export class ProfileRepo {

  private db: Knex;
  private table: Knex.QueryBuilder<IProfile, {}>;
  constructor(db: Knex) {
    this.db = db;
    this.table = this.db.table<IProfile>(tableNames.profiles)
  }

  public async create(data: IProfile): Promise<IProfile> {
    const [inserted] = await this.table.insert(data, "*");
    return inserted;
  }

  public async getById(profile_id: number): Promise<Profile | null> {
    const found = await this.db.table<IProfile>(tableNames.profiles)
      .select("*")
      .where('profile_id', profile_id)
      .first();
    if (!found) return null;

    const currency = await this.db.table<ICurrency>('currencies')
      .select("*")
      .where('currency_iso_code', found.preferred_currency)
      .first();

    if (!currency) return null;
    const currInstance = new Currency(currency);

    return new Profile({ ...found, preferred_currency: currInstance });
  }

}
