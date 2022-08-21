import { ITransaction } from "../types";
import { IDependencies } from "../../infra/dependencies/definitions";
import { BaseDomain } from "../common/BaseDomain";

type TransactionCreate = {
  account_id: number;
  amount: number;
  category: string;
  description: string | null | undefined;
  created_at: Date | null | undefined;
  updated_at?: Date | null | undefined;
  transaction_id?: number | null | undefined;
}


export class Transaction  extends BaseDomain {

  protected _data: ITransaction;

  constructor(data: TransactionCreate, deps: IDependencies) {
    super(deps);
    this._data = {
      transaction_id: data.transaction_id || null,
      account_id: data.account_id,
      amount: data.amount,
      category: data.category,
      description: data.description || null,
      created_at: data.updated_at || new Date(),
      updated_at: data.updated_at || new Date(),
    }
  }

  public get data() {
    return this._data;
  }


}
