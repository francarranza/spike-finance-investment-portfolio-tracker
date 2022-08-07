import { IDependencies } from "../../infra/dependencies";
import { Currency } from "../domain/Currency";

type Input = {
  currency_iso_code: string;
  name: string;
  symbol: string;
}

export default async function addCurrency(params: Input, deps: IDependencies) {

  const currency = new Currency(params)
  await currency.persist()
  return currency;

}
