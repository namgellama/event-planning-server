import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("events", (table) => {
        table
            .enu("status", ["upcoming", "completed"], {
                useNative: true,
                enumName: "event_status",
            })
            .notNullable()
            .defaultTo("upcoming");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("events", (table) => {
        table.dropColumn("status");
    });

    await knex.raw(`DROP TYPE IF EXISTS event_status`);
}
