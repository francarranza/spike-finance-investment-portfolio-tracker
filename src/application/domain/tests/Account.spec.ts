import { expect } from "chai";
import { before, describe, it } from "mocha";
import { truncateDb } from "../../../infra/database";
import { Account } from "../Account";
import { Currency } from "../Currency";

describe('Account Domain', () => {

  before(async () => {
    await truncateDb();
    const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$'});
    await dollar.persist();
  });

  it('Account.getBalance(): Should return starting balance', async () => {
    const binance = new Account({ 
      name: 'Binance', description: '', currency_iso_code: 'USD', starting_balance: 900,
    })
    await binance.persist();
    const balance = await binance.getBalance();
    expect(balance).eq(900);
  });

  it('Account.getBalance(): Should return latest balance = -50 USD', async () => {
    const binance = new Account({ 
      name: 'Binance2', description: '', currency_iso_code: 'USD', starting_balance: 900,
    })
    await binance.persist();
    await binance.updateBalance({ new_balance: 100, });
    await binance.updateBalance({ new_balance: 100, });
    await binance.updateBalance({ new_balance: 100, });
    await binance.updateBalance({ new_balance: -50, });
    const balance = await binance.getBalance();
    expect(balance).eq(-50);
  });

})
