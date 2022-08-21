import { ICurrency } from "../types";
import { IDependencies } from "../../infra/dependencies/definitions";
import { BaseDomain } from "../common/BaseDomain";
import { DomainError } from "../common/errors/DomainError";

export class Currency extends BaseDomain {

  readonly _data: ICurrency;

  constructor(data: ICurrency, deps: IDependencies) {
    super(deps);
    this._data = data;
  }

  public get data() {
    return this._data;
  }

  public async persist() {
    if (!this._data) throw new DomainError('Currency is not initialized with data');
    await this.deps.repositories.currency.create(this._data);
  }

  public async listAll() {
    return await this.deps.repositories.currency.list();
  }

  public async addRate({
    quote_currency,
    value,
    type,
    close_at = new Date()
  }: {
    quote_currency: Currency,
    value: number,
    type?: string | null,
    close_at?: Date
  }) {
    return await this.deps.repositories.currency.insertNewRate({
      base: this._data.currency_iso_code,
      quote: quote_currency._data.currency_iso_code,
      value,
      type,
     close_at 
    });
  }
}
