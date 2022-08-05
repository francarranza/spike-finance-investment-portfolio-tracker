import { Knex } from "knex";
import { AccountRepo } from "../application/repositories/AccountRepo";
import { CurrencyRepo } from "../application/repositories/CurrencyRepo";
import { db } from "./database";


export interface IDependencies {
  db: Knex,
  repositories: {
    account: AccountRepo,
    currency: CurrencyRepo,
  }
}

const currencyRepo = new CurrencyRepo(db);
const accountRepo = new AccountRepo(db, currencyRepo);

const deps: IDependencies = {
  db,
  repositories: {
    account: accountRepo,
    currency: currencyRepo,
  }
}

export default deps;
