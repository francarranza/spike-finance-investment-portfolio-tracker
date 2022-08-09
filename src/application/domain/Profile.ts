import { IProfile } from "../types";
import deps, { IDependencies } from "../../infra/dependencies";

type ProfileCreate = {
  firstname: string;
  preferred_currency: string;
  profile_id?: number | null | undefined;
  lastname?: string | null;
  email?: string | null;
}

export class Profile {

  private deps: IDependencies;
  readonly data: IProfile;
  protected isPersisted: boolean = false;

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

  public async listAccounts() {
    if (!this.data?.profile_id) throw new Error('Profile is not initialized with data');
    const accounts = await this.deps.repositories.account.listByProfile(this.data.profile_id);
    return accounts;
  }

}
