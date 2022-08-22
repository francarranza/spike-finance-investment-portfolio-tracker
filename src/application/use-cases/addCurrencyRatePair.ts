import { IDependencies } from "../../infra/dependencies/definitions";
import { Currency } from "../domain/Currency";

type Input = {
  base_iso_currency: string;
  quote_iso_currency: string;
  value: number;
  close_at: Date;
  type?: string;
}

export default async function addCurrencyRatePair(params: Input, deps: IDependencies) {

  if (Date.now() - params.close_at.getTime() < 0) throw new Error('close_date cant be in the future');
  if (params.base_iso_currency === params.quote_iso_currency) throw new Error('base and quote currencies cant be the same one');

  const [
    base,
    quote
  ] = await Promise.all([
    deps.repositories.currency.getByIsoCode(params.base_iso_currency),
    deps.repositories.currency.getByIsoCode(params.quote_iso_currency),
  ]).then(icurrs => icurrs.map(c => c && new Currency(c, deps)));

  if (!base || !quote) throw new Error('Base or Quote currencies do not exist in our db');

  return await base.addRate({ 
    quote_currency: quote, 
    value: params.value, 
    type: params.type, 
    close_at: params.close_at 
  })

}
