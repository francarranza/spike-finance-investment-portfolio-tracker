import { ICurrency, IProfile } from "../types";
import deps, { IDependencies } from "../../infra/dependencies";
import { Account, inAccount } from "./Account";
import { Currency } from "./Currency";

type ProfileCreate = {
  firstname: string;
  preferred_currency: string;
  profile_id?: number | null | undefined;
  lastname?: string | null;
  email?: string | null;
}

type AccountCreate = {
  name: string,
  currency: Currency;
  description?: string | null,
  bank_name?: string | null,
  starting_balance?: number,
}

export class Profile {

  private deps: IDependencies;
  private _data: IProfile;
  private _accounts: Account[] = [];

  constructor({
    firstname,
    preferred_currency,
    profile_id = null,
    lastname = null,
    email = null,
  }: ProfileCreate) {
    this.deps = deps;
    this._data = {
      profile_id,
      firstname,
      lastname,
      email,
      preferred_currency,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (!firstname) throw new Error('Profile: Please provide a firstname');
    if (!preferred_currency) throw new Error('Profile: Please provide a currency');
  }

  public get data() {
    return this._data;
  }

  public get accounts() {
    return this._accounts;
  }

  public async persist() {
    if (!this._data) throw new Error('Profile is not initialized with data');
    const created = await this.deps.repositories.profile.create(this._data);
    this._data = created;
  }

  public async getAccounts() {
    if (!this._data?.profile_id) throw new Error('Profile is not initialized with data');
    const accounts = await this.deps.repositories.account.listByProfile(this._data.profile_id);
    this._accounts = accounts;
    return accounts;
  }

  /**
   * Creates account with selected currency
   */
  public async createAccount(input: AccountCreate) {
    if (!this._data?.profile_id) throw new Error('Profile is not initialized with data');
    const created = new Account({ ...input, profile_id: this._data.profile_id }, input.currency);
    await created.persist()
    this._accounts.push(created);
    return created;
  }

  /**
   * Get balance from all accounts applying selected currency rates.
   */
  public async getWholeBalance(currency: Currency) {
    if (!this._accounts.length) {
      await this.getAccounts();
    }

    const accountBalancesProms = this._accounts.map(acc => {
      return acc.getBalance(currency);
    });

    const accountBalances = await Promise.all(accountBalancesProms);
    const total = accountBalances.reduce((prev, total) => prev + total, 0);

    const print = this._accounts.map((acc, index) => {
      const balanceKey = `Balance in ${currency.data.currency_iso_code}`
      return { 'Account Name': acc.data.name, 'Currency': acc.data.currency_iso_code, [balanceKey]: accountBalances[index] }
    })

    print.push({ 'Account Name': 'Total', 'Currency': currency.data.currency_iso_code, balance: total });
    console.table(print)

    return total;
  }

}
