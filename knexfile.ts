import type { Knex } from "knex";
import { appConfig } from "./src/infra/config";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: appConfig.db.filepath
    },
    migrations: {
      tableName: 'migrations',
      extension: 'ts',
      directory: 'src/infra/database/migrations'
    }

  },

};

module.exports = config;
