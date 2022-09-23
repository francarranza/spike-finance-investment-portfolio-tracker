import { Knex } from "knex";
import { tableNames } from "../types";


export async function up(knex: Knex): Promise<void> {

  await knex.schema.createTable(tableNames.profiles, (table) => {
    table.increments('profile_id');
    table.string('firstname');
    table.string('lastname');
    table.string('email');
    table.string('preferred_currency');
    table.date('created_at');
    table.date('updated_at');
    table.foreign('preferred_currency').references('currencies.currency_iso_code');
  });

}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableNames.profiles);
}

