import { AccountActivityRepo } from "../../application/repositories/AccountActivityRepo";
import { AccountRepo } from "../../application/repositories/AccountRepo";
import { CurrencyRepo } from "../../application/repositories/CurrencyRepo";
import { ProfileRepo } from "../../application/repositories/ProfileRepo";
import { db } from "../database";
import { ConsoleLogger } from "../logger/ConsoleLogger";
import { IDependencies } from "./definitions";


const logger = new ConsoleLogger();
const currencyRepo = new CurrencyRepo(db, logger);
const accountRepo = new AccountRepo(db, logger, currencyRepo);
const accountActivityRepo = new AccountActivityRepo(db, logger, currencyRepo);
const profileRepo = new ProfileRepo(db, logger);

const deps: IDependencies = {
  db,
  logger,
  repositories: {
    account: accountRepo,
    currency: currencyRepo,
    accountActivity: accountActivityRepo,
    profile: profileRepo,
  }
}

export default deps;
