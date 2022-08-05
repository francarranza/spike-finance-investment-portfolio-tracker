import type { Knex } from "knex";
import { appConfig } from "./src/infra/config";

// Update with your config settings.
const migrations = {
  tableName: 'migrations',
  extension: 'ts',
  directory: 'src/infra/database/migrations'
}

const dbConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: appConfig.db.filepath
    },
    migrations
  },
  test: {
    client: "better-sqlite3",
    connection: {
      filename: 'data/test.sqlite'
    },
    migrations,
  },



};

export default dbConfig;
