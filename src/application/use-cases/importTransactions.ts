import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { IDependencies } from "../../infra/dependencies/definitions";
import { Profile } from "../domain/Profile";
import { Currency } from '../domain/Currency';

type ColumnMapping = {
    account_name: string;
    amount: string;
    category?: string;
    currency?: string;
    date: string;
    description: string;
}

type Input = {
  columnMapping: ColumnMapping;
  filepath: string;
  importSourceName: string;
  profile: Profile;
}

export default async function importTransactions(params: Input, deps: IDependencies) {

  const accounts = await params.profile.getAccounts();
  const accountNames = accounts.map(account => account.name);
  const currencies = accounts.map(account => account.currency_iso_code);

  // load csv
  fs.createReadStream(params.filepath)
    .pipe(csv.parse({ headers: true }))
    .transform((row: any, next): void => {
      const category = params.columnMapping.category ? row[params.columnMapping.category] : null;
      const currency = params.columnMapping.currency ? row[params.columnMapping.currency] : null;
      next(null, {
        account_name: row[params.columnMapping.account_name],
        amount: row[params.columnMapping.amount],
        category,
        currency,
        date: row[params.columnMapping.date],
        description: row[params.columnMapping.description],
      })
    })
    .transform((row: ColumnMapping, next): void => {

      if (!currencies.includes(row.currency)) {
        throw new Error('Not Implemented')
      }

      next();

    })

  // get all account names
  // upsert accounts

  // get all currencies
  // upsert currencies



}

async function  upsertTransaction() {
  // check date, description, amount isnt already in db
  // insert

}
