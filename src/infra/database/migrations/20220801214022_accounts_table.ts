import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  await knex.schema.createTable('currencies', (table) => {
    table.string('currency_iso_code').primary();
    table.string('name').notNullable();
    table.string('symbol');
  });

  await knex.schema.createTable('accounts', (table) => {
    table.increments('account_id');
    table.string('name').notNullable();
    table.string('description');
    table.string('bank_name');
    table.float('starting_balance').defaultTo(0).notNullable();
    table.string('currency_iso_code');
    table.foreign('currency_iso_code').references('currencies.currency_iso_code');
  });

}


export async function down(knex: Knex): Promise<void> {

  await knex.schema.dropTableIfExists('accounts');
  await knex.schema.dropTableIfExists('currencies');
}

