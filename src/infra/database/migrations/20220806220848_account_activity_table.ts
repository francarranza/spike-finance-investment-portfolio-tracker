import { Knex } from "knex";
import { tableNames } from "../types";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableNames.accountActivity, (table) => {
    table.increments('activity_id');
    table.integer('account_withdrawal_id').notNullable();
    table.integer('account_deposit_id').notNullable();
    table.float('amount_withdrawal').notNullable();
    table.float('amount_deposit').notNullable();
    table.string('description');
    table.float('fees');
    table.date('open_at').notNullable();
    table.date('created_at').notNullable();
    table.foreign('account_withdrawal_id').references('accounts.account_id');
    table.foreign('account_deposit_id').references('accounts.account_id');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tableNames.accountActivity);
}

