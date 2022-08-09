import { assert, expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import { faker } from '@faker-js/faker';
import { truncateDb } from "../../../infra/database";
import deps from "../../../infra/dependencies";
import { Profile } from "../Profile";
import { Currency } from "../Currency";

describe('Profile Domain', () => {

  describe('Profile.create()', () => {

    beforeEach(async () => {
      await truncateDb();
    })

    it('Create new Profile without firstname', async () => {
      try {
        new Profile({
          firstname: '',
          lastname: faker.name.lastName(),
          email: faker.internet.email(),
          preferred_currency: 'EUR'
        });
        assert.fail();
      } catch (err) {
        expect(err).instanceOf(Error);
      }

    });

    it('Create new Profile without currency', async () => {
      try {
        new Profile({
          firstname: faker.name.firstName(),
          lastname: faker.name.lastName(),
          email: faker.internet.email(),
          preferred_currency: ''
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
        preferred_currency: 'EUR'
      });
      await profile.persist()

      const found = await deps.repositories.profile.getById(1);
      expect(found?.data.email).eq(profile.data.email);
    });

    it('Profile.persist(): Error currency does not exists', async () => {
      const profile = new Profile({
        profile_id: 1,
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        preferred_currency: 'EUR'
      });

      try {
        await profile.persist()
        assert.fail();
      } catch (err) {
        expect(err).instanceOf(Error)
      }

    });
  });


})
