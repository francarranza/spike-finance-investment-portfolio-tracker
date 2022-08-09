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
  description?: string | null,
  bank_name?: string | null,
  starting_balance?: number,
}

export class Profile {

  private deps: IDependencies;
  readonly data: IProfile;
  protected isPersisted: boolean = false;
  protected accounts: Account[] = [];

  constructor({
    firstname,
    preferred_currency,
    profile_id = null,
    lastname = null,
    email = null,
  }: ProfileCreate) {
    this.deps = deps;
    this.data = {
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

  public async persist() {
    if (!this.data) throw new Error('Profile is not initialized with data');
    await this.deps.repositories.profile.create(this.data);
    this.isPersisted = true;
  }

  public async getAccounts() {
    if (!this.data?.profile_id) throw new Error('Profile is not initialized with data');
    const accounts = await this.deps.repositories.account.listByProfile(this.data.profile_id);
    this.accounts = accounts;
    return accounts;
  }

  public async createAccount(account: AccountCreate, currency: Currency) {
    if (!this.data?.profile_id) throw new Error('Profile is not initialized with data');
    const created = new Account({ ...account, profile_id: this.data.profile_id }, currency);
    await created.persist()
    this.accounts.push(created);
    return created;
  }

}
