import { tableNames } from "../../infra/database/types";
import { IDependencies } from "../../infra/dependencies/definitions";
import { BaseRepository } from "../common/BaseRepository";
import { Transaction } from "../domain/Transaction";
import { ITransaction } from "../types";

export class TransactionRepo extends BaseRepository<ITransaction> {

  constructor(deps: IDependencies) {
    super(tableNames.transactions, deps)
  }

  public async create(data: ITransaction): Promise<ITransaction> {
    const [inserted] = await this.table.insert(data, "*");
    return inserted;
  }

  public async getById(transaction_id: number): Promise<Transaction | null> {
    const found = await this.db.table<ITransaction>(tableNames.profiles)
      .select("*")
      .where('transaction_id', transaction_id)
      .first();
    if (!found) return null;
    return new Transaction({ ...found }, this.deps);
  }

}
