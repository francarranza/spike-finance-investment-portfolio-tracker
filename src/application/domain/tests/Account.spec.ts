import { assert, expect } from "chai";
import { describe, it } from "mocha";
import testDeps from "../../../../test/setup/dependencies";
import { truncateDb } from "../../../infra/database";
import { Account } from "../Account";
import { Currency } from "../Currency";
import { Profile } from "../Profile";

describe('Account Domain', () => {

  describe('Account.addTransaction()', () => {

    let dollar: Currency;
    let profile: Profile;
    let account: Account;

    beforeEach(async () => {
      await truncateDb();

      dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' }, testDeps);
      await dollar.persist();

      profile = new Profile({ profile_id: 1, firstname: 'asd', preferred_currency: dollar }, testDeps)
      await profile.persist()

      account = await profile.createAccount({
        name: 'Binance', description: '', starting_balance: 900, currency: dollar
      })
      await account.persist();
    });

    it('Should fail to add new transaction with unknown category', async () => {
      try {
        await account.addTransaction({ amount: 100, category: 'Housing', })
        assert.fail();
      } catch (err) {
        expect(err).instanceOf(Error)
      }
    });

    it('Should succeed adding new transaction with valid category', async () => {
      const category = 'Car';
      await testDeps.repositories.transaction.createCategory({ name: category, description: null });
      const t = await account.addTransaction({ amount: 100, category, });
      expect(t.data.amount).eq(100);
      expect(t.data.category).eq(category);
      expect(t.data.account_id).eq(account.data.account_id)
      expect(t.data.description).is.null;

      if (!t.data.transaction_id) assert.fail();
      const retrieved = await testDeps.repositories.transaction.getById(t.data.transaction_id)
      if (!retrieved) assert.fail();
      expect(retrieved.amount).eq(100);
      expect(retrieved.category).eq(category);
      expect(retrieved.account_id).eq(account.data.account_id)
      expect(retrieved.description).is.null;

    });

  })

  describe('Account.getBalance()', () => {

    let dollar: Currency;
    let profile: Profile;

    beforeEach(async () => {
      await truncateDb();

      dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' }, testDeps);
      await dollar.persist();

      profile = new Profile({ profile_id: 1, firstname: 'asd', preferred_currency: dollar }, testDeps)
      await profile.persist()
    });

    it('Should return starting balance', async () => {

      const binance = await profile.createAccount({
        name: 'Binance', description: '', starting_balance: 900, currency: dollar
      })

      const balance = await binance.getBalance();
      expect(balance).eq(900);
    });

    it('Should calc with bank transfers', async () => {

      const binance = await profile.createAccount({
        name: 'Binance', description: '', starting_balance: 0, currency: dollar
      });

      const revolut = await profile.createAccount({
        name: 'Revolut', starting_balance: 900, currency: dollar
      });

      await revolut.transferMoney({ to_account: binance, amount: 300, open_at: new Date() });
      expect(await revolut.getBalance()).eq(900-300)
      expect(await binance.getBalance()).eq(0+300)

      await binance.transferMoney({ to_account: revolut, amount: 100, open_at: new Date() });
      expect(await revolut.getBalance()).eq(900-300+100)
      expect(await binance.getBalance()).eq(0+300-100)


    });

    it('Should return calc with transactions', async () => {
      const category = 'Car';
      await testDeps.repositories.transaction.createCategory({ name: category, description: null });
      const account = await profile.createAccount({
        name: 'Binance', description: '', starting_balance: 900, currency: dollar
      });

      await account.addTransaction({ amount: 500, category })
      expect(await account.getBalance()).eq(900 + 500);

      await account.addTransaction({ amount: -200, category })
      expect(await account.getBalance()).eq(900 + 500 - 200);
    })
  })

})
