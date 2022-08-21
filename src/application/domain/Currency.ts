import { ICurrency } from "../types";
import deps from "../../infra/dependencies";
import { IDependencies } from "../../infra/dependencies/definitions";

export class Currency {

  private deps: IDependencies;
  readonly data: ICurrency;

  constructor(data: ICurrency) {
    this.deps = deps;
    this.data = data;
  }

  public async persist() {
    if (!this.data) throw new Error('Currency is not initialized with data');
    await this.deps.repositories.currency.create(this.data);
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
      base: this.data.currency_iso_code,
      quote: quote_currency.data.currency_iso_code,
      value,
      type,
     close_at 
    });
  }
}
