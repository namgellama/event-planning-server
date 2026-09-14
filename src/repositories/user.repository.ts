import { db } from "../db/index.js";
import type { User } from "../types/user.js";
import type { RegisterUserInput } from "../validations/auth.validation.js";

export async function findById(id: string): Promise<User | undefined> {
    return await db<User>("users").select("*").where("id", id).first();
}

export async function findByEmail(email: string): Promise<User | undefined> {
    return await db<User>("users").select("*").where("email", email).first();
}

export async function create(body: RegisterUserInput): Promise<Omit<User, "password">> {
    const [user] = await db<User>("users").insert(body).returning("*");
    const { password, ...rest } = user!;

    return rest;
}

export async function saveTwoFactorSecret(userId: string, secret: string): Promise<number> {
    return await db<User>("users").where({ id: userId }).update({
        twoFactorSecret: secret,
    });
}

export async function enableTwoFactor(userId: string): Promise<number> {
    return await db<User>("users").where({ id: userId }).update({
        twoFactorEnabled: true,
    });
}
