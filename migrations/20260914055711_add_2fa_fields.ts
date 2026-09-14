import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.boolean("two_factor_enabled").notNullable().defaultTo(false);
        table.text("two_factor_secret").nullable();
        table.jsonb("two_factor_backup_codes").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.dropColumn("two_factor_enabled");
        table.dropColumn("two_factor_secret");
        table.dropColumn("two_factor_backup_codes");
    });
}
