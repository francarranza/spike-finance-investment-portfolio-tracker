import { Knex } from "knex";
import dbConfig from '../../../knexfile'
import { appConfig } from "../config";
import { tableNames } from "./types";
import knex from 'knex';

export const db: Knex = knex(dbConfig[appConfig.node_env]);

export async function truncateDb() {
  if (process.env.NODE_ENV !== 'test') throw new Error('DANGER: YOU ARE NOT IN TEST MODE');
  const tableOrder = [
    tableNames.currencyRates,
    tableNames.accountActivity,
    tableNames.balanceUpdates,
    tableNames.transactions,
    tableNames.accounts,
    tableNames.profiles,
    tableNames.currencies,
    tableNames.transactionCategories,
  ];

  for (const table of tableOrder) {
    await db.table(table).truncate();
  }

  return;
}
