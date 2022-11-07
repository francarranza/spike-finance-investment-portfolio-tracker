import { program } from "commander";
import process from "process";
import { Currency } from "../../../application/domain/Currency";
import { Account } from "../../../application/domain/Account";
import deps from "../../dependencies";
import addCurrency from "../../../application/use-cases/addCurrency";
import addCurrencyRatePair from "../../../application/use-cases/addCurrencyRatePair";
import importAccountBalances from "../../../application/use-cases/importAccountBalances";

program
  .name('Personal Finance Tracker')
  .description('Accounts and Currencies managment')
  .version('1.0.0');

program
  .command('currencies-add')
  .description('Add new currency')
  .argument('<iso_code>', 'Eg: EUR, USD, GBP')
  .argument('<name>', 'Eg: Euro, Dollar, Pound')
  .argument('<symbol>', 'Eg: €, $')
  .action(async (iso_code, name, symbol) => {
    const currency = await addCurrency({ currency_iso_code: iso_code, name, symbol }, deps);
    console.info(currency.data);
    process.exit(0);
  });

program
  .command('currencies-add-rate')
  .description('Add new currency rate pair')
  .option('--base <string>', 'Currency ISO code. Eg: EUR, USD')
  .option('--quote <string>', 'Currency ISO code. Eg: EUR, USD')
  .option('--value <number>', 'Value of pair')
  .action(async ({ base, quote, value }) => {
    const close_at = new Date();
    const pair = await addCurrencyRatePair({ 
      base_iso_currency: base, 
      quote_iso_currency: quote,
      value,
      close_at,
    }, deps);
    console.info(pair);
    process.exit(0);
  });

program
  .command('currencies-list')
  .description('List all currencies')
  .action(async () => {
    const currencies = await deps.repositories.currency.list()
    console.table(currencies);
    process.exit(0);
  });

program.command('accounts-add')
  .option('--name <string>', 'Account\'s name')
  .option('--currency <string>', 'Currency ISO code. Eg: EUR, USD')
  .option('--bank <string>', 'Bank name')
  .option('--starting-balance <number>', 'Starting balance in selected currency')
  .action(async ({ name, currency, bank, startingBalance }) => {
    const curr = new Currency({ currency_iso_code: currency, name: '', symbol: ''})
    const account = new Account({
      name,
      bank_name: bank,
      profile_id: 1,
      starting_balance: startingBalance,
    }, curr);
    await account.persist();
    console.info(account)
    process.exit(0);
  });

program
  .command('accounts-list')
  .description('List all accounts')
  .action(async () => {
    const accounts = await deps.repositories.account.list()
    console.table(accounts);
    process.exit(0);
  });

program
  .command('accounts-update-balance')
  .description('Update account balance')
  .option('--name <string>', 'Account\'s name')
  .option('--new-balance <number>', 'New balance amount')
  .action(async ({ name, newBalance }) => {
    const accountDb = await deps.repositories.account.getByName(name)
    if (!accountDb) {
      console.error('Account not found')
      process.exit(1)
    }

    const currency = await deps.repositories.currency.getByIsoCode(accountDb.currency_iso_code);
    if (!currency) {
      console.error('Currency not found')
      process.exit(1)
    }

    const account = new Account(accountDb, currency);
    const beforeBalance = await account.getBalance();
    console.info(`${beforeBalance} ${account.data.currency_iso_code} is the account ${account.data.name} balance before update`)

    await account.updateBalance({ new_balance: newBalance });
    const afterBalance = await account.getBalance()
    console.info(`${afterBalance} ${account.data.currency_iso_code} is the account ${account.data.name} balance before update`)
    process.exit(0);
  });

program
  .command('accounts-status')
  .description('Balances summary in selected currency')
  .option('--currency <string>', 'Currency ISO code. Eg: EUR')
  .action(async ({ currency }) => {
    if(!currency) {
      console.error('Must provide a currency ISO code')
      process.exit(1)
    }

    const currInstance = await deps.repositories.currency.getByIsoCode(currency)
    if (!currInstance) {
      console.error('Currency not found')
      process.exit(1)
    }

    const profile = await deps.repositories.profile.getById(1);
    await profile?.printAccountStatus(currInstance);
    process.exit(0);
  });

program
  .command('import-balances')
  .description('Import account balances updates from CSV file')
  .option('--filepath <string>', 'Absolute filepath')
  .action(({ filepath }) => {
    if(!filepath) {
      console.error('Must provide a filepath')
      process.exit(1)
    }

    importAccountBalances(filepath, deps);
    process.exit(0);
  });


program.parse();
