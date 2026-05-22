import type { Knex } from 'knex';

const AID_CATEGORIES = ['HOUSING', 'FOOD', 'HEALTH', 'ENERGY', 'OTHER'];
const AID_STATUSES = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('aid_requests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('beneficiary_id').notNullable().index();
    table
      .enum('category', AID_CATEGORIES, {
        useNative: true,
        enumName: 'aid_category',
      })
      .notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.text('description').notNullable();
    table
      .enum('status', AID_STATUSES, {
        useNative: true,
        enumName: 'aid_status',
      })
      .notNullable()
      .defaultTo('PENDING');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('aid_requests');
  await knex.raw('DROP TYPE IF EXISTS aid_category');
  await knex.raw('DROP TYPE IF EXISTS aid_status');
}
