import { Knex } from "knex";
import { tableNames } from "../types";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableNames.balanceUpdates, (table) => {
    table.increments('balance_update_id');
    table.integer('account_id').notNullable();
    table.string('description').nullable();
    table.float('new_balance').notNullable();
    table.dateTime('updated_at').notNullable();
    table.foreign('account_id').references('accounts.account_id');
  });

}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableNames.balanceUpdates);
}

