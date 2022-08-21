import { Knex } from "knex";
import { tableNames } from "../../infra/database/types";
import { ILogger } from "../../infra/logger/definitions";
import { RepositoryError } from "../../infra/database/errors";


export class BaseRepository{
  
  protected db: Knex;
  protected logger: ILogger;
  protected tablename: string;

  constructor(tablename: string, db: Knex, logger: ILogger) {
    this.db = db;
    this.logger = logger;
    this.tablename = tablename;

    if (!Object.values(tableNames).includes(tablename)) {
      throw new RepositoryError('Invalid tablename');
    }
  }

}
