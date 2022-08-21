import { Knex } from "knex";
import { AccountActivityRepo } from "../../application/repositories/AccountActivityRepo";
import { AccountRepo } from "../../application/repositories/AccountRepo";
import { CurrencyRepo } from "../../application/repositories/CurrencyRepo";
import { ProfileRepo } from "../../application/repositories/ProfileRepo";
import { Logger } from "../logger/definitions";


export interface IDependencies {
  db: Knex;
  logger: Logger;
  repositories: {
    account: AccountRepo;
    currency: CurrencyRepo;
    accountActivity: AccountActivityRepo;
    profile: ProfileRepo;
  };
}
