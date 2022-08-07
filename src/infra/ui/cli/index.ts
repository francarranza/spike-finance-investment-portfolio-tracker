import { program } from "commander";
import process from "process";
import { Currency } from "../../../application/domain/Currency";
import { Account } from "../../../application/domain/Account";
import deps from "../../dependencies";

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
    const currency = new Currency({ currency_iso_code: iso_code, name, symbol })
    await currency.persist()
    console.info(currency.info);
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
    const account = new Account({
      name,
      currency_iso_code: currency,
      bank_name: bank,
      starting_balance: startingBalance
    });
    await account.persist();
    console.info(account.info)
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
    const account = new Account(accountDb);
    const beforeBalance = await account.getBalance();
    console.info(`${beforeBalance} ${account.info.currency_iso_code} is the account ${account.info.name} balance before update`)

    await account.updateBalance({ new_balance: newBalance });
    const afterBalance = await account.getBalance()
    console.info(`${afterBalance} ${account.info.currency_iso_code} is the account ${account.info.name} balance before update`)
    process.exit(0);
  });

program.parse();
