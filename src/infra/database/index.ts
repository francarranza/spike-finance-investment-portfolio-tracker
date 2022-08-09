import { Knex } from "knex";
import dbConfig from '../../../knexfile'
import { appConfig } from "../config";
import { tableNames } from "./types";

export const db: Knex = require("knex")(dbConfig[appConfig.node_env]);

export async function truncateDb() {
  if (process.env.NODE_ENV !== 'test') throw new Error('DANGER: YOU ARE NOT IN TEST MODE');
  const tableOrder = [
    tableNames.currencyRates,
    tableNames.accountActivity,
    tableNames.balanceUpdates,
    tableNames.accounts,
    tableNames.profiles,
    tableNames.currencies,
  ];

  for (const table of tableOrder) {
    await db.table(table).truncate();
  }

  return;
}
