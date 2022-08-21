import { AccountActivityRepo } from "../../src/infra/database/repositories/AccountActivityRepo";
import { AccountRepo } from "../../src/infra/database/repositories/AccountRepo";
import { CurrencyRepo } from "../../src/infra/database/repositories/CurrencyRepo";
import { ProfileRepo } from "../../src/infra/database/repositories/ProfileRepo";
import { db } from "../../src/infra/database";
import { IDependencies } from "../../src/infra/dependencies/definitions";
import { SilentLogger } from "../../src/infra/logger/SilentLogger";

const logger = new SilentLogger();
const currencyRepo = new CurrencyRepo(db, logger);
const accountRepo = new AccountRepo(db, logger, currencyRepo);
const accountActivityRepo = new AccountActivityRepo(db, logger, currencyRepo);
const profileRepo = new ProfileRepo(db, logger);

const testDeps: IDependencies = {
  db,
  logger,
  repositories: {
    account: accountRepo,
    currency: currencyRepo,
    accountActivity: accountActivityRepo,
    profile: profileRepo,
  }
}

export default testDeps;
