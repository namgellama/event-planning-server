import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("tags", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

        table.string("title", 100).notNullable();

        table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");

        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("tags");
}
