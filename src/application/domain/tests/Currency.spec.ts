import { assert, expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import testDeps from "../../../../test/setup/dependencies";
import { db, truncateDb } from "../../../infra/database";
import { tableNames } from "../../../infra/database/types";
import { ICurrencyRate } from "../../types";
import { Currency } from "../Currency";

describe('Currency Domain', () => {

  const deps = testDeps;

  describe('Currency.create()', () => {

    beforeEach(async () => {
      await truncateDb();
    })

    it('Create new currency', async () => {
      const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' }, deps);
      await dollar.persist();

      const retrieve = await deps.repositories.currency.getByIsoCode('USD');
      if (!retrieve) assert.fail();
      expect(retrieve.name).eq('Dollar');
      expect(retrieve.symbol).eq('$');
    });

    it('Attempt to create existing currency', async () => {
      const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' }, deps);
      await dollar.persist();

      const dollar2 = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' }, deps);
      try {
        await dollar2.persist();
        assert.fail();
      } catch (err) {
        expect(err).instanceof(Error);
      }
    });

  });

  describe('Currency.addRate()', () => {

    beforeEach(async () => {
      await truncateDb();
    })

    it('Should add new rate', async () => {

      const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' }, deps);
      await dollar.persist();

      const peso = new Currency({ currency_iso_code: 'ARS', name: 'Peso', symbol: '$' }, deps);
      await peso.persist();

      await peso.addRate({ quote_currency: dollar, value: 293 });
      const rate: ICurrencyRate = await db.table(tableNames.currencyRates).select('*').first();
      expect(rate.base).eq(peso._data.currency_iso_code)
      expect(rate.quote).eq(dollar._data.currency_iso_code)
      expect(rate.value).eq(293);
    });

  })

})
