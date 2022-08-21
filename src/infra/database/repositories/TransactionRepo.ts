import { Knex } from "knex";
import { tableNames } from "../types";
import { ILogger } from "../../logger/definitions";
import { BaseRepository } from "./common/BaseRepository";
import { ITransaction } from "../../../application/types";

export class TransactionRepo extends BaseRepository {

  constructor(db: Knex, logger: ILogger) {
    super(tableNames.transactions, db, logger)
  }

  public async create(data: ITransaction): Promise<ITransaction> {
    const [inserted] = await this.db.table(this.tablename).insert(data, "*");
    return inserted;
  }

  public async getById(transaction_id: number): Promise<ITransaction | null> {
    const found = await this.db.table<ITransaction>(tableNames.profiles)
      .select("*")
      .where('transaction_id', transaction_id)
      .first();
    return found || null;
  }

}
