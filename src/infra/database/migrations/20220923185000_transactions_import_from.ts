import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  await knex.schema.createTable('import_sources', (table) => {
    table.string('name').primary();
    table.text('description').nullable();
  });

  await knex.schema.raw(`
    ALTER TABLE transactions 
      ADD COLUMN imported_from VARCHAR(255) 
      REFERENCES import_sources(name)
  `);
  
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('import_sources');
  await knex.schema.raw(`ALTER TABLE transactions DROP COLUMN imported_from`);
}

