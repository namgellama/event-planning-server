import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.index("email");
        table
            .enu("role", ["user", "admin"], {
                useNative: true,
                enumName: "user_role",
            })
            .notNullable()
            .defaultTo("user");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.dropIndex("email");
        table.dropColumn("role");
    });

    await knex.raw(`DROP TYPE IF EXISTS user_role`);
}
