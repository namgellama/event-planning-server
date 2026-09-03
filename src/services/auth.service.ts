import bcrypt from "bcrypt";
import type { Response } from "express";
import ms from "ms";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import * as userRepository from "../repositories/user.repository.js";
import type { User } from "../types/user.js";
import { signToken } from "../utils/jwt.js";
import type { LoginUserInput, RegisterUserInput } from "../validations/auth.validation.js";

export async function register(body: RegisterUserInput): Promise<Omit<User, "password">> {
    const user = await userRepository.findByEmail(body.email);

    if (user) {
        throw new AppError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    return userRepository.create({ ...body, password: hashedPassword });
}

export async function login(
    res: Response,
    body: LoginUserInput,
): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await userRepository.findByEmail(body.email);

    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(body.password, user.password);

    if (!isValid) {
        throw new AppError(401, "Invalid credentials");
    }

    const accessToken = signToken({ sub: user.id }, env.JWT_ACCESS_SECRET, env.JWT_ACCESS_EXPIRY);
    const refreshToken = signToken(
        { sub: user.id },
        env.JWT_REFRESH_EXPIRY,
        env.JWT_REFRESH_EXPIRY,
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ms(env.JWT_REFRESH_EXPIRY as ms.StringValue),
    });

    return { accessToken, refreshToken };
}
