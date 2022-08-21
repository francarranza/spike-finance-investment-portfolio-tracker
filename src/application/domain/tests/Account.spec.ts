import { expect } from "chai";
import { describe, it } from "mocha";
import testDeps from "../../../../test/setup/dependencies";
import { truncateDb } from "../../../infra/database";
import { Currency } from "../Currency";
import { Profile } from "../Profile";

describe('Account Domain', () => {

  beforeEach(async () => {
    await truncateDb();
  });

  it('Account.getBalance(): Should return starting balance', async () => {
    const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' }, testDeps);
    await dollar.persist();
    const profile = new Profile({ profile_id: 1, firstname: 'asd', preferred_currency: dollar }, testDeps)
    await profile.persist()

    const binance = await profile.createAccount({
      name: 'Binance', description: '', starting_balance: 900, currency: dollar
    })

    const balance = await binance.getBalance();
    expect(balance).eq(900);
  });

})
