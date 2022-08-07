import { ICurrency } from "../types";
import deps, { IDependencies } from "../../infra/dependencies";

export class Currency {

  private deps: IDependencies;
  protected data: ICurrency;
  protected isPersisted: boolean = false;

  constructor(data: ICurrency) {
    this.deps = deps;
    this.data = data;
  }

  get info() {
    return this.data;
  }

  public async persist() {
    if (!this.data) throw new Error('Currency is not initialized with data');
    await this.deps.repositories.currency.create(this.data);
    this.isPersisted = true;
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
