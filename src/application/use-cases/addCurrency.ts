import { IDependencies } from "../../infra/dependencies/definitions";
import { Currency } from "../domain/Currency";

type Input = {
  currency_iso_code: string;
  name: string;
  symbol: string;
}

export default async function addCurrency(params: Input, deps: IDependencies) {

  const currency = new Currency(params, deps)
  await currency.persist()
  return currency;

}
