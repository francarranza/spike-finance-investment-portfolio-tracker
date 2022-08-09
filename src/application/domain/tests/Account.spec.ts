import { expect } from "chai";
import { before, describe, it } from "mocha";
import { truncateDb } from "../../../infra/database";
import { Account } from "../Account";
import { Currency } from "../Currency";

describe('Account Domain', () => {

  beforeEach(async () => {
    await truncateDb();
  });

  it('Account.getBalance(): Should return starting balance', async () => {
    const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' });
    await dollar.persist();

    const binance = new Account({
      name: 'Binance', description: '', starting_balance: 900,
    }, dollar)
    await binance.persist();
    const balance = await binance.getBalance();
    expect(balance).eq(900);
  });

})
