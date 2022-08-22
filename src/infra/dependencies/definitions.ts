import { Knex } from "knex";
import { AccountActivityRepo } from "../database/repositories/AccountActivityRepo";
import { AccountRepo } from "../database/repositories/AccountRepo";
import { CurrencyRepo } from "../database/repositories/CurrencyRepo";
import { ProfileRepo } from "../database/repositories/ProfileRepo";
import { TransactionRepo } from "../database/repositories/TransactionRepo";
import { ILogger } from "../logger/definitions";


export interface IDependencies {
  db: Knex;
  logger: ILogger;
  repositories: IRepoDependencies;
}

export interface IRepoDependencies {
  account: AccountRepo;
  currency: CurrencyRepo;
  accountActivity: AccountActivityRepo;
  profile: ProfileRepo;
  transaction: TransactionRepo;
}
