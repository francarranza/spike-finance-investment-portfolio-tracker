import { AccountActivityRepo } from "../../application/repositories/AccountActivityRepo";
import { AccountRepo } from "../../application/repositories/AccountRepo";
import { CurrencyRepo } from "../../application/repositories/CurrencyRepo";
import { ProfileRepo } from "../../application/repositories/ProfileRepo";
import { db } from "../database";
import { ConsoleLogger } from "../logger/ConsoleLogger";
import { IDependencies } from "./definitions";


const currencyRepo = new CurrencyRepo(db);
const accountRepo = new AccountRepo(db, currencyRepo);
const accountActivityRepo = new AccountActivityRepo(db, currencyRepo);
const profileRepo = new ProfileRepo(db);

const deps: IDependencies = {
  db,
  logger: new ConsoleLogger(),
  repositories: {
    account: accountRepo,
    currency: currencyRepo,
    accountActivity: accountActivityRepo,
    profile: profileRepo,
  }
}

export default deps;
