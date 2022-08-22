import { AccountActivityRepo } from "../database/repositories/AccountActivityRepo";
import { AccountRepo } from "../database/repositories/AccountRepo";
import { CurrencyRepo } from "../database/repositories/CurrencyRepo";
import { ProfileRepo } from "../database/repositories/ProfileRepo";
import { db } from "../database";
import { ConsoleLogger } from "../logger/ConsoleLogger";
import { IDependencies } from "./definitions";
import { TransactionRepo } from "../database/repositories/TransactionRepo";


const logger = new ConsoleLogger();
const currencyRepo = new CurrencyRepo(db, logger);
const accountRepo = new AccountRepo(db, logger, currencyRepo);
const accountActivityRepo = new AccountActivityRepo(db, logger, currencyRepo);
const profileRepo = new ProfileRepo(db, logger);
const transactionRepo = new TransactionRepo(db, logger);

const deps: IDependencies = {
  db,
  logger,
  repositories: {
    account: accountRepo,
    currency: currencyRepo,
    accountActivity: accountActivityRepo,
    profile: profileRepo,
    transaction: transactionRepo,
  }
}

export default deps;
