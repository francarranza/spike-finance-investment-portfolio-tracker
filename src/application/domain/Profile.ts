import { IProfile } from "../types";
import { IDependencies } from "../../infra/dependencies/definitions";
import { Account } from "./Account";
import { Currency } from "./Currency";
import { DomainError } from "../common/errors/DomainError";
import { BaseDomain } from "../common/BaseDomain";

type ProfileCreate = {
  firstname: string;
  preferred_currency: Currency;
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

export class ProfileError extends DomainError {}

export class Profile extends BaseDomain {

  protected _data: IProfile;
  protected _currency: Currency;
  protected _accounts: Account[] = [];

  constructor({
    firstname,
    preferred_currency,
    profile_id = null,
    lastname = null,
    email = null,
  }: ProfileCreate, deps: IDependencies) {
    super(deps);
    this._currency = preferred_currency;
    this._data = {
      profile_id,
      firstname,
      lastname,
      email,
      preferred_currency: preferred_currency._data.currency_iso_code,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (!firstname) throw new ProfileError('Profile: Please provide a firstname');
    if (!preferred_currency) throw new ProfileError('Profile: Please provide a currency');
  }

  public get data() {
    return this._data;
  }

  public get accounts() {
    return this._accounts;
  }

  public async persist() {
    if (!this._data) throw new ProfileError('Profile is not initialized with data');
    const created = await this.deps.repositories.profile.create(this._data);
    this._data = created;
  }

  public async getAccounts() {
    if (!this._data?.profile_id) throw new ProfileError('Profile is not initialized with data');
    const accounts = await this.deps.repositories.account.listByProfile(this._data.profile_id);
    this._accounts = accounts.map(a => new Account(a, this._currency));
    return accounts;
  }

  public async printAccountStatus(currency: Currency = this._currency) {
    type PrintRow = {
      account_id: number | undefined | null,
      name: string,
      description: string | null,
      bank_name: string | null,
      balance: number,
      currency: string,
    };

    if (!this._accounts.length) {
      await this.getAccounts();
    }

    const accountBalances = await Promise.all(this._accounts.map(acc => acc.getBalance(currency)));
    const toPrint = this._accounts.map(({ _data: data }, index): PrintRow => {
      return {
        account_id: data.account_id,
        name: data.name,
        description: data.description,
        bank_name: data.bank_name,
        balance: accountBalances[index],
        currency: currency._data.currency_iso_code || data.currency_iso_code
      }
    });

    this.logger.info('All account status')
    this.logger.table(toPrint)

    const total = await this.getWholeBalance(currency);
    this.logger.info('Whole accounts balance')
    this.logger.info(`${total.toLocaleString()} ${currency._data.currency_iso_code}`)

  }

  /**
   * Creates account with selected currency
   */
  public async createAccount(input: AccountCreate) {
    if (!this._data.profile_id) throw new ProfileError('Profile is not initialized with data');
    const created = new Account({
      ...input,
      account_id: null,
      profile_id: this._data.profile_id
    }, input.currency);
    await created.persist()
    this._accounts.push(created);
    return created;
  }

  /**
   * Get balance from all accounts applying selected currency rates.
   */
  public async getWholeBalance(currency: Currency = this._currency) {
    if (!this._accounts.length) {
      await this.getAccounts();
    }

    const accountBalancesProms = this._accounts.map(acc => {
      return acc.getBalance(currency);
    });

    const accountBalances = await Promise.all(accountBalancesProms);
    const total = accountBalances.reduce((prev, total) => prev + total, 0);
    return total;
  }

}
