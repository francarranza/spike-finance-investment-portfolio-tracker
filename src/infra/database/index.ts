import { Knex } from "knex";
import { appConfig } from "../config";

export const db: Knex = require("knex")({
  client: 'better-sqlite3',
  connection: {
    filename: appConfig.db.filepath
  },
  migrations: {
    tableName: 'migrations',
    extension: 'ts',
    directory: 'src/infra/database/migrations'
  }
});
