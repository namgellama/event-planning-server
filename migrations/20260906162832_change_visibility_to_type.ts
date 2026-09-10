import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("events", (table) => {
        table.renameColumn("visibility", "type");
        table.dropIndex("visibility");
        table.dropIndex("date");
    });

    await knex.schema.alterTable("tags", (table) => {
        table.index("user_id");
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

    await knex.schema.alterTable("tags", (table) => {
        table.dropIndex("user_id");
    });

    return knex.schema.alterTable("events", (table) => {
        table.renameColumn("type", "visibility");
        table.index("visibility");
        table.index("date");
    });
}
