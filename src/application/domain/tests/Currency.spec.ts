import { assert, expect } from "chai";
import { before, describe, it } from "mocha";
import { truncateDb } from "../../../infra/database";
import deps from "../../../infra/dependencies";
import { Currency } from "../Currency";

describe('Currency Domain', () => {

  before(async () => {
    await truncateDb();
  });

  describe('Currency.create()', () => {

    it('Create new currency', async () => {
      const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' });
      await dollar.persist();

      const retrieve = await deps.repositories.currency.getByIsoCode('USD');
      expect(retrieve).is.not.null;
      expect(retrieve.name).eq('Dollar');
      expect(retrieve.symbol).eq('$');
    });

    it('Attempt to create existing currency', async () => {
      await truncateDb();
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

    it('Should add new rate', async () => {

      const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' });
      await dollar.persist();

      const peso = new Currency({ currency_iso_code: 'ARS', name: 'Dollar', symbol: '$' });
      await peso.persist();
    });

  })

})
