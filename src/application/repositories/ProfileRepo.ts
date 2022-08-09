import { Knex } from "knex";
import { tableNames } from "../../infra/database/types";
import { Profile } from "../domain/Profile";
import { IProfile } from "../types";

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
    const found = await this.db.table(tableNames.profiles)
      .select("*")
      .where('profile_id', profile_id)
      .first();
    if (!found) return null;
    return new Profile(found);
  }

}
