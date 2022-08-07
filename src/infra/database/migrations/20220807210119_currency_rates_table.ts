import { Knex } from "knex";
import { tableNames } from "../types";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableNames.currencyRates, (table) => {
    table.increments('currency_rate_id');
    table.string('base').notNullable();
    table.string('quote').notNullable();
    table.string('type');
    table.float('value');
    table.date('close_at').notNullable();
    table.date('created_at').notNullable();
    table.foreign('base').references('currencies.iso_code');
    table.foreign('quote').references('currencies.iso_code');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableNames.currencyRates);
}

