import { Knex } from "knex";
import { AccountActivityRepo } from "../application/repositories/AccountActivityRepo";
import { AccountRepo } from "../application/repositories/AccountRepo";
import { CurrencyRepo } from "../application/repositories/CurrencyRepo";
import { ProfileRepo } from "../application/repositories/ProfileRepo";
import { db } from "./database";


export interface IDependencies {
  db: Knex,
  repositories: {
    account: AccountRepo,
    currency: CurrencyRepo,
    accountActivity: AccountActivityRepo,
    profile: ProfileRepo,
  }
}

const currencyRepo = new CurrencyRepo(db);
const accountRepo = new AccountRepo(db, currencyRepo);
const accountActivityRepo = new AccountActivityRepo(db, currencyRepo);
const profileRepo = new ProfileRepo(db);

const deps: IDependencies = {
  db,
  repositories: {
    account: accountRepo,
    currency: currencyRepo,
    accountActivity: accountActivityRepo,
    profile: profileRepo,
  }
}

export default deps;
