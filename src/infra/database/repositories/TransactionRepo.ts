import { Knex } from "knex";
import { tableNames } from "../types";
import { ILogger } from "../../logger/definitions";
import { BaseRepository } from "./common/BaseRepository";
import { ITransaction, ITransactionCategory } from "../../../application/types";

export class TransactionRepo extends BaseRepository {

  constructor(db: Knex, logger: ILogger) {
    super(tableNames.transactions, db, logger)
  }

  public async create(data: ITransaction): Promise<ITransaction> {
    const [inserted] = await this.db.table(this.tablename).insert(data, "*");
    return inserted;
  }

  public async getById(transaction_id: number): Promise<ITransaction | null> {
    const found = await this.db.table<ITransaction>(this.tablename)
      .select("*")
      .where('transaction_id', transaction_id)
      .first();
    return found || null;
  }

  public async createCategory(data: ITransactionCategory): Promise<ITransactionCategory> {
    const [inserted] = await this.db.table(tableNames.transactionCategories).insert(data, "*");
    return inserted;
  }

  public async list(account_id?: number): Promise<ITransaction[]> {
    if (account_id) {
      return await this.db.table(this.tablename)
        .select('*')
        .where('account_id', account_id)
        .orderBy('created_at', 'desc');
    }

    return await this.db.table(this.tablename)
      .select('*')
      .orderBy('created_at', 'desc');
  }

  public async listIncome(account_id: number): Promise<ITransaction[]> {
    return await this.db.table(this.tablename)
      .select('*')
      .where('account_id', account_id)
      .where('amount', '>', 0)
      .orderBy('created_at', 'desc');
  }

  public async listExpenses(account_id: number): Promise<ITransaction[]> {
    return await this.db.table(this.tablename)
      .select('*')
      .where('account_id', account_id)
      .where('amount', '<', 0)
      .orderBy('created_at', 'desc');
  }
}
