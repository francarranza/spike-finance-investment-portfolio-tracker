import { Knex } from "knex";
import { tableNames } from "../../infra/database/types";
import { IAccountActivity } from "../types";
import { CurrencyRepo } from "./CurrencyRepo";

export class AccountActivityRepo {

  private db: Knex;
  private currencyRepo: CurrencyRepo;

  constructor(db: Knex, currencyRepo: CurrencyRepo) {
    this.db = db;
    this.currencyRepo = currencyRepo;
  }

  public async list(): Promise<IAccountActivity[]> {
    return await this.db.table(tableNames.accountActivity)
      .select('*')
      .orderBy('open_at', 'desc');
  }

  public async listWithdrawals(account_id: number): Promise<IAccountActivity[]> {
    return await this.db.table(tableNames.accountActivity)
      .select('*')
      .where('account_withdrawal_id', account_id)
      .orderBy('open_at', 'desc');
  }

  public async listDeposits(account_id: number): Promise<IAccountActivity[]> {
    return await this.db.table(tableNames.accountActivity)
      .select('*')
      .where('account_deposit_id', account_id)
      .orderBy('open_at', 'desc');
  }

  public async create({
    account_withdrawal_id,
    account_deposit_id,
    amount_withdrawal,
    amount_deposit,
    description = null,
    fees = null,
    open_at,
  }: {
    account_withdrawal_id: number,
    account_deposit_id: number,
    amount_withdrawal: number,
    amount_deposit: number,
    description?: string | null;
    fees?: number | null,
    open_at: Date,
  }): Promise<IAccountActivity> {
    const created_at = new Date();
    const [created] = await this.db
      .table(tableNames.accountActivity)
      .insert({
        account_withdrawal_id,
        account_deposit_id,
        amount_withdrawal,
        amount_deposit,
        description,
        fees,
        open_at,
        created_at
      }, "*");
    return created;
  }

}


