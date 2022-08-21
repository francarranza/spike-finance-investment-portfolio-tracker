import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  await knex.schema.createTable('transaction_categories', (table) => {
    table.string('name').primary();
    table.string('description').nullable();
  });

  await knex.schema.createTable('transactions', (table) => {
    table.increments('transaction_id');
    table.integer('account_id');
    table.string('category').notNullable();
    table.string('description');
    table.float('amount').notNullable();
    table.date('created_at');
    table.date('updated_at');
    table.foreign('account_id').references('accounts.account_id');
    table.foreign('category').references('transaction_categories.name');
  });

}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transaction_categories');
  await knex.schema.dropTableIfExists('transactions');
}

