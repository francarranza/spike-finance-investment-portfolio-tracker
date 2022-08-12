import { Currency } from "../../../application/domain/Currency";

export default async function seedCurrencies() {

  const dollar = new Currency({ currency_iso_code: 'USD', name: 'Dollar', symbol: '$' });
  const peso = new Currency({ currency_iso_code: 'ARS', name: 'Peso', symbol: '$' });
  const euro = new Currency({ currency_iso_code: 'EUR', name: 'Euro', symbol: '€' });

  await Promise.all([
    dollar.persist(),
    peso.persist(),
    euro.persist(),
  ]);

  // Currency rates
  await Promise.all([
    dollar.addRate({ quote_currency: peso, value: 292 }),
    dollar.addRate({ quote_currency: euro, value: 0.98 }),
    peso.addRate({ quote_currency: euro, value: 1 / 300 }),
    peso.addRate({ quote_currency: dollar, value: 1 / 292 }),
    euro.addRate({ quote_currency: peso, value: 300 }),
    euro.addRate({ quote_currency: dollar, value: 1.02 }),
  ]);

  return {
    dollar,
    peso,
    euro
  }
}
