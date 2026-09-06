import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("events", (table) => {
        table.renameColumn("visibility", "type");
    });

    await knex.raw(`
            ALTER TYPE event_visibility
            RENAME TO event_type
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
            ALTER TYPE event_type
            RENAME TO event_visibility
    `);

    return knex.schema.alterTable("events", (table) => {
        table.renameColumn("type", "visibility");
    });
}
