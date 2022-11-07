import * as csv from 'fast-csv'
import * as fs from 'fs'
import path from 'path';
import { IDependencies } from '../../infra/dependencies';


type RowCsv = {
  account_name: string | null;
  amount: string | null;
  date: string | null;
  description: string | null;
}

type ParsedRow = {
  account_name: string | null;
  amount: number | null;
  date: Date | null;
  description: string | null;
}

export function readCSV({
  filepath = '',
  delimiter = ','
}): Promise<[string[], string[][]]> {

  console.info('readCSV.Importing file: ' + filepath);
  let stream = fs.createReadStream(filepath);

  return new Promise((resolve, reject) => {

    let csvData: any[] = [];
    let csvStream = csv.parse({ delimiter, objectMode: true })
      .on('data', (data) => csvData.push(data))
      .on('error', error => reject(error))
      .on('end', () => {
        const headers = csvData.shift() || [];
        resolve([headers, csvData]);
      });
    stream.pipe(csvStream);

  });

}


export default async function importAccountBalances(filepath: string, deps: IDependencies) {


  const [headers, rows] = await readCSV({ filepath });
  console.log(rows)
  console.log(headers)

  fs.createReadStream(filepath)
    .pipe(csv.parse({ headers: true }))
    .on('data', async (row) => {

      console.log(row)
      if (!row.account_name) return;

      const date = Date.parse(String(row.date)) ? new Date(String(row.date)) : null;
      const account = await deps.repositories.account.getByName(row.account_name);

      if (!account) {
        console.log('Skipping row. Account not found:', row.account_name);
        return;
      }

      return await deps.repositories.account.createBalanceUpdate({
        account_id: account.account_id,
        new_balance: parseFloat(String(row.amount)) || null,
        description: row.description,
        updated_at: date,
      })

    })
    .pipe(process.stdout)
    .on('end', () => process.exit());

}
