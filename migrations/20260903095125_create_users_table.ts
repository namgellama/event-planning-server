import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    knex.raw("CREATE EXTENSION IF NOT EXISTS pgcrypto");

    return knex.schema.createTable("users", function (table) {
        (table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")),
            table.string("name", 100).notNullable(),
            table.string("email", 255).notNullable().unique(),
            table.string("password").notNullable(),
            table.timestamps(true, true));
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}
