import { assert, expect } from "chai";
import { before, beforeEach, describe, it } from "mocha";
import { db, truncateDb } from "../../../infra/database";
import { tableNames } from "../../../infra/database/types";
import deps from "../../../infra/dependencies";
import { ICurrencyRate } from "../../types";
import { Currency } from "../Currency";

describe('Currency Domain', () => {

  describe('Currency.create()', () => {

    beforeEach(async () => {
      await truncateDb();
    })

    it('Create new currency', async () => {
      const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' });
      await dollar.persist();

      const retrieve = await deps.repositories.currency.getByIsoCode('USD');
      expect(retrieve).is.not.null;
      expect(retrieve.name).eq('Dollar');
      expect(retrieve.symbol).eq('$');
    });

    it('Attempt to create existing currency', async () => {
      const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' });
      await dollar.persist();

      const dollar2 = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' });
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

      const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' });
      await dollar.persist();

      const peso = new Currency({ currency_iso_code: 'ARS', name: 'Peso', symbol: '$' });
      await peso.persist();

      await peso.addRate({ quote_currency: dollar, value: 293 });
      const rate: ICurrencyRate = await db.table(tableNames.currencyRates).select('*').first();
      expect(rate.base).eq(peso.info.currency_iso_code)
      expect(rate.quote).eq(dollar.info.currency_iso_code)
      expect(rate.value).eq(293);
    });

  })

})
