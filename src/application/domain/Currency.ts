import { ICurrency } from "../types";
import deps, { IDependencies } from "../../infra/dependencies";

export class Currency {

  private deps: IDependencies;
  protected data: ICurrency | null = null;

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
  }

  public async listAll() {
    return await this.deps.repositories.currency.list();
  }
}
