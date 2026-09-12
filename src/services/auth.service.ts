import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import ms from "ms";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import * as userRepository from "../repositories/user.repository.js";
import type { User } from "../types/user.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import type {
    LoginUserInput,
    RegisterUserInput,
    SendOtpInput,
    VerifyOtpInput,
} from "../validations/auth.validation.js";
import * as emailService from "./email.service.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import { redis } from "../config/redis.js";

const registerOtpKey = (email: string) => `register-otp:${email}`;

const registerVerifiedKey = (email: string) => `register-verified:${email}`;

export async function sendOtp(body: SendOtpInput): Promise<void> {
    const otpKey = registerOtpKey(body.email);
    const verifiedKey = registerVerifiedKey(body.email);

    // Invalidate previous verification
    await redis.del(verifiedKey);

    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    await redis.set(otpKey, hashedOtp, "EX", ms("5m"));

    await emailService.sendEmail({
        to: body.email,
        subject: "Your verification code",
        html: `
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This otp expires in 5 minutes.</p>
            `,
    });
}

export async function verifyOtp(body: VerifyOtpInput): Promise<void> {
    const otpKey = registerOtpKey(body.email);
    const verifiedKey = registerVerifiedKey(body.email);

    const storedHash = await redis.get(otpKey);

    if (!storedHash) {
        throw new AppError(404, "OTP expired or not found. Send OTP again");
    }

    const hashedOtp = hashOtp(body.otp);

    if (storedHash !== hashedOtp) {
        throw new AppError(400, "Invalid OTP. Please try again");
    }

    await redis.del(otpKey);
    await redis.set(verifiedKey, "1", "EX", ms("10m"));
}

export async function register(body: RegisterUserInput): Promise<Omit<User, "password">> {
    const verifiedKey = registerVerifiedKey(body.email);

    const verified = await redis.get(verifiedKey);

    if (verified === "1") {
        throw new AppError(400, "Please verify your email first");
    }

    const user = await userRepository.findByEmail(body.email);

    if (user) {
        throw new AppError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const newUser = await userRepository.create({ ...body, password: hashedPassword });

    await redis.del(verifiedKey);

    return newUser;
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

    const accessToken = signToken(
        { sub: user.id, role: user.role },
        env.JWT_ACCESS_SECRET,
        env.JWT_ACCESS_EXPIRY,
    );
    const refreshToken = signToken(
        { sub: user.id, role: user.role },
        env.JWT_REFRESH_SECRET,
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

export async function logout(res: Response): Promise<void> {
    res.clearCookie("refreshToken");
}

export async function refreshToken(req: Request): Promise<string> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new AppError(401, "No refresh token found");
    }

    const payload = verifyToken(refreshToken, env.JWT_REFRESH_SECRET);

    const user = await userRepository.findById(payload.sub);

    if (!user) {
        throw new AppError(401, "User not found");
    }

    return signToken(
        { sub: user.id, role: user.role },
        env.JWT_ACCESS_SECRET,
        env.JWT_ACCESS_EXPIRY,
    );
}

export async function getMe(userId: string): Promise<Omit<User, "password">> {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const { password, ...rest } = user;

    return rest;
}
