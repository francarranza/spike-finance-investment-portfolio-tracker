import { Currency } from "../../../application/domain/Currency";

export default async function seedCurrencies() {

  const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' });
  await dollar.persist();

  const peso = new Currency({ currency_iso_code: 'ARS', name: 'Peso', symbol: '$' });
  await peso.persist();

  const euro = new Currency({ currency_iso_code: 'EUR', name: 'Euro', symbol: '€' });
  await euro.persist();

  // Currency rates
  await dollar.addRate({ quote_currency: peso, value: 290 })
  await dollar.addRate({ quote_currency: peso, value: 300 })
  await dollar.addRate({ quote_currency: euro, value: 1.10 })
  await euro.addRate({ quote_currency: peso, value: 300 })

  return {
    dollar,
    peso,
    euro
  }
}
