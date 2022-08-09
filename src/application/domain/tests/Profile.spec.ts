import { assert, expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import { Faker, faker } from '@faker-js/faker';
import { truncateDb } from "../../../infra/database";
import deps from "../../../infra/dependencies";
import { Profile } from "../Profile";
import { Currency } from "../Currency";
import seedCurrencies from "../../../infra/database/seeds/currencies";

describe('Profile Domain', () => {

  describe('Profile.create()', () => {

    beforeEach(async () => {
      await truncateDb();
    })

    it('Create new Profile without firstname', async () => {
      const dollar = new Currency({ currency_iso_code: 'USD', symbol: 'a', name: 'Dollar' });
      await dollar.persist()

      try {
        new Profile({
          firstname: '',
          lastname: faker.name.lastName(),
          email: faker.internet.email(),
          preferred_currency: dollar
        });
        assert.fail();
      } catch (err) {
        expect(err).instanceOf(Error);
      }

    });

    it('Profile.persist(): Success', async () => {
      const currency = new Currency({ name: 'Euro', currency_iso_code: 'EUR', symbol: '€' })
      await currency.persist();

      const profile = new Profile({
        profile_id: 1,
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        preferred_currency: currency
      });
      await profile.persist()

      const found = await deps.repositories.profile.getById(1);
      expect(found?.data.email).eq(profile.data.email);
    });

    it('Profile.persist(): Error currency does not exists', async () => {
      const dollar = new Currency({ currency_iso_code: 'USD', symbol: 'a', name: 'Dollar' });
      const profile = new Profile({
        profile_id: 1,
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        preferred_currency: dollar
      });

      try {
        await profile.persist()
        assert.fail();
      } catch (err) {
        expect(err).instanceOf(Error)
      }

    });
  });

  describe('Profile.create()', () => {

    beforeEach(async () => {
      await truncateDb();
    });

    it('Should calculate whole balance', async() => {
      const dollar = new Currency({ currency_iso_code: 'USD', symbol: 'a', name: 'Dollar' });
      const euro = new Currency({ currency_iso_code: 'EUR', symbol: 'a', name: 'Euro' });
      await Promise.all([ dollar.persist(), euro.persist() ]);

      // Rates
      await euro.addRate({ quote_currency: dollar, value: 1.10 })
      await euro.addRate({ quote_currency: dollar, value: 2.00 })
      await dollar.addRate({ quote_currency: euro, value: 0.5 })

      const profile = new Profile({ firstname: faker.name.firstName(), preferred_currency: euro,  })
      await profile.persist();

      await profile.createAccount({ name: 'A', currency: euro, starting_balance: 1000 });
      await profile.createAccount({ name: 'B', currency: dollar, starting_balance: 1000 });

      const wholeInEuro = await profile.getWholeBalance()
      const wholeInDollar = await profile.getWholeBalance(dollar)

      expect(wholeInEuro).eq(1000 + (1000 * 0.5));
      expect(wholeInDollar).eq(1000 + (1000 * 2));

    })
  });

})
