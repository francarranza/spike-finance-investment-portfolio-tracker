import { Knex } from "knex";
import { tableNames } from "../../infra/database/types";
import { IDependencies } from "../../infra/dependencies/definitions";
import { RepositoryError } from "./errors/RepositoryError";


export class BaseRepository<T>{
  
  protected deps: IDependencies;
  protected db: Knex;
  protected table: Knex.QueryBuilder<T, any>;

  constructor(tablename: string, deps: IDependencies) {
    this.deps = deps;
    this.db = deps.db;
    this.table = this.db.table<T>(tablename);

    if (!Object.values(tableNames).includes(tablename)) {
      throw new RepositoryError('Invalid tablename');
    }
  }

}
