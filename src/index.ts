import { Currency } from "./application/domain/Currency";
import { Profile } from "./application/domain/Profile";
import { truncateDb } from "./infra/database";
import deps, { IDependencies } from "./infra/dependencies";


async function main(deps: IDependencies) {

  await truncateDb()

  const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' });
  await dollar.persist();

  const peso = new Currency({ currency_iso_code: 'ARS', name: 'Peso', symbol: '$' });
  await peso.persist();

  const profile = new Profile({ firstname: 'Francisco', preferred_currency: 'USD' });
  await profile.persist();

  const binance = await profile.createAccount({ name: 'Binance', description: '' }, dollar)
  await binance.updateBalance({ new_balance: 1200, description: 'monthly transfer' })
  await binance.updateBalance({ new_balance: -100, description: 'monthly transfer' })
  await binance.updateBalance({ new_balance: 800 })

  // Transfer money
  const brubank = await profile.createAccount({ name: 'Brubank Ahorro', description: 'Day to day use', starting_balance: 3500 }, peso);
  await brubank.persist();
  await brubank.transferMoney({
    to_account: binance,
    amount: 500,
    open_at: new Date('2021-01-01')
  });

  await binance.transferMoney({
    to_account: brubank,
    amount: 200,
    open_at: new Date('2021-02-01')
  })

  await binance.getStats();

  // Currency rates
  await dollar.addRate({ quote_currency: peso, value: 290 })
  await dollar.addRate({ quote_currency: peso, value: 300 })


  // Balance in other currency
  await binance.getStats(peso);

  // List accounts from profile
  console.info('PROFILE GET ACCOUNTS')
  await profile.getAccounts()
  console.log(profile.accounts)

  process.exit(0)
}

main(deps)

