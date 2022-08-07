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

})
