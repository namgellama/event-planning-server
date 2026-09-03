import type { RegisterUserInput } from "../validations/auth.validation.js";
import * as userRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import { AppError } from "../errors/app-error.js";

export async function register(body: RegisterUserInput) {
    const email = await userRepository.findByEmail(body.email);

    if (email) {
        throw new AppError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    return userRepository.create({ ...body, password: hashedPassword });
}
