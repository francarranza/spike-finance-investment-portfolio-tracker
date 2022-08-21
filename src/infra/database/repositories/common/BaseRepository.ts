import { Knex } from "knex";
import { tableNames } from "../../types";
import { ILogger } from "../../../logger/definitions";
import { RepositoryError } from "./errors";


export class BaseRepository {

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
