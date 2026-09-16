import type { Knex } from "knex";

import { hashPassword } from "../src/utils/password";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert({
        email: "admin@admin.com",
        name: "Admin",
        role: "admin",
        password: await hashPassword("admin"),
    });
}
