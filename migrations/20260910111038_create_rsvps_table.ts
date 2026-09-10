import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("rsvps", (table) => {
        table.uuid("event_id").notNullable().references("id").inTable("events").onDelete("CASCADE");

        table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");

        table.primary(["event_id", "user_id"]);

        table
            .enu("status", ["yes", "no", "maybe"], {
                useNative: true,
                enumName: "rsvp_status",
            })
            .notNullable();

        table.timestamps(true, true);

        table.unique(["event_id", "user_id"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("rsvps");
}
