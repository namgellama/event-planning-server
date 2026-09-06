import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("event_tags", (table) => {
        table.uuid("event_id").notNullable().references("id").inTable("events").onDelete("CASCADE");

        table.uuid("tag_id").notNullable().references("id").inTable("tags").onDelete("CASCADE");

        table.primary(["event_id", "tag_id"]);

        table.index("tag_id");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("event_tags");
}
