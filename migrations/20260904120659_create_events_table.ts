import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("events", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

        table.string("title", 100).notNullable();

        table.text("description");

        table.datetime("date", { useTz: true }).notNullable();

        table.string("location", 255).notNullable();

        table
            .enu("visibility", ["public", "private"], {
                useNative: true,
                enumName: "event_visibility",
            })
            .notNullable()
            .defaultTo("public");

        table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");

        table.timestamps(true, true);

        table.index("date");
        table.index("user_id");
        table.index("visibility");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable("events")
        .then(() => knex.raw("DROP TYPE IF EXISTS event_visibility"));
}
