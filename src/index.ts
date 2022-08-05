import { Account } from "./application/domain/Account";
import { Currency } from "./application/domain/Currency";
import { db } from "./infra/database";
import { tableNames } from "./infra/database/types";
import deps, { IDependencies } from "./infra/dependencies";


async function main(deps: IDependencies) {

  await db.table(tableNames.balanceUpdates).truncate()
  await db.table('accounts').truncate()
  await db.table('currencies').truncate();

  await Promise.all([
    (new Currency({ currency_iso_code: 'EUR', name: 'Euro', symbol: '€'})).persist(),
    (new Currency({ currency_iso_code: 'ARS', name: 'Peso', symbol: '$'})).persist(),
    (new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$'})).persist(),
    (new Currency({ currency_iso_code: 'GBP', name: 'Pound', symbol: '£'})).persist(),
  ])

  await Promise.all([
    (new Account({ name: 'Cash', description: 'Dinero que tengo en la mano', starting_balance: 50, currency_iso_code: 'ARS' })).persist(),
    (new Account({ name: 'Cuenta N26', description: 'Cuenta que uso para gastar en el dia a dia', starting_balance: 3500, currency_iso_code: 'EUR' })).persist(),
    (new Account({ name: 'Cuenta Sabadell', description: 'Solo para pagar el alquiler', starting_balance: 350, currency_iso_code: 'EUR' })).persist(),
  ]);

  const binance = new Account({ name: 'Binance', description: '', currency_iso_code: 'USD', })
  await binance.persist();
  await binance.updateBalance({ new_balance: 1200, description: 'monthly transfer' })
  await binance.updateBalance({ new_balance: -100, description: 'monthly transfer' })
  await binance.updateBalance({ new_balance: 800 })

  console.log(await binance.getBalance())
  process.exit(0)

}

main(deps)

