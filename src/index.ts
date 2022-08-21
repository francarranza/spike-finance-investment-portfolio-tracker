import { Currency } from "./application/domain/Currency";
import { Profile } from "./application/domain/Profile";
import { truncateDb } from "./infra/database";
import seedCurrencies from "./infra/database/seeds/currencies";
import deps from "./infra/dependencies";
import { IDependencies } from "./infra/dependencies/definitions";

async function main(deps: IDependencies) {

  await truncateDb()
  const {
    peso,
    dollar,
    euro
  } = await seedCurrencies()

  const profile = new Profile({ firstname: 'Francisco', preferred_currency: dollar });
  await profile.persist();

  // Create accounts
  const binance = await profile.createAccount({ name: 'Binance', description: '', currency: dollar })
  const brubank = await profile.createAccount({ name: 'Brubank Ahorro', description: 'Day to day use', starting_balance: 3500, currency: peso });
  const n26 = await profile.createAccount({ name: 'N26 Account', description: 'Pay rent', currency: euro });

  // Update balances
  await binance.updateBalance({ new_balance: 1200, description: 'monthly transfer' })
  await binance.updateBalance({ new_balance: -100, description: 'monthly transfer' })
  await binance.updateBalance({ new_balance: 800 })

  await n26.updateBalance({ new_balance: 2500 });

  // Transfer money
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

  console.log('binance', await binance.getBalance(), binance._data.currency_iso_code);
  console.log('brubank', await brubank.getBalance(), brubank._data.currency_iso_code);
  console.log('n26', await n26.getBalance(), n26._data.currency_iso_code);

  console.info('Profile Whole Balance');
  console.info(await profile.getWholeBalance(peso), peso.data.name)

  process.exit(0)
}

main(deps)

