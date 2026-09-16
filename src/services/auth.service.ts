import type { Request, Response } from "express";
import ms from "ms";
import QRCode from "qrcode";

import { env } from "@/config/env.js";
import { redis } from "@/config/redis.js";
import { AppError } from "@/errors/app-error.js";
import * as userRepository from "@/repositories/user.repository.js";
import type { User } from "@/types/user.js";
import { generate2FAToken, signToken, verify2FAToken, verifyToken } from "@/utils/jwt.js";
import { generateOtp, hashOtp } from "@/utils/otp.js";
import { comparePassword, hashPassword } from "@/utils/password.js";
import { createTotpSecret, createTotpUri, verifyTotp } from "@/utils/totp.js";
import type {
    Disable2FAInput,
    LoginUserInput,
    RegisterUserInput,
    SendOtpInput,
    Verify2FAInput,
    Verify2FASetupInput,
    VerifyEmailInput,
} from "@/validations/auth.validation.js";
import * as emailService from "./email.service.js";

const registerOtpKey = (email: string) => `register-otp:${email}`;
const registerVerifiedKey = (email: string) => `register-verified:${email}`;

export async function sendOtp(body: SendOtpInput): Promise<void> {
    const user = await userRepository.findByEmail(body.email);

    if (user) {
        throw new AppError(409, "Email already exists");
    }

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

export async function verifyEmail(body: VerifyEmailInput): Promise<void> {
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

    if (verified !== "1") {
        throw new AppError(400, "Please verify your email first");
    }

    const user = await userRepository.findByEmail(body.email);

    if (user) {
        throw new AppError(409, "Email already exists");
    }

    const hashedPassword = await hashPassword(body.password);

    const newUser = await userRepository.create({ ...body, password: hashedPassword });

    await redis.del(verifiedKey);

    return newUser;
}

export async function login(
    res: Response,
    body: LoginUserInput,
): Promise<
    { requires2FA: boolean; twoFactorToken: string } | { requires2FA: boolean; accessToken: string }
> {
    const user = await userRepository.findByEmail(body.email);

    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const isValid = await comparePassword(body.password, user.password);

    if (!isValid) {
        throw new AppError(401, "Invalid credentials");
    }

    if (user.twoFactorEnabled) {
        const twoFactorToken = generate2FAToken(user.id);

        return {
            requires2FA: true,
            twoFactorToken: twoFactorToken,
        };
    }

    const accessToken = signToken(
        { sub: user.id, role: user.role, type: "access" },
        env.JWT_ACCESS_SECRET,
        env.JWT_ACCESS_EXPIRY,
    );
    signToken(
        { sub: user.id, role: user.role, type: "refresh" },
        env.JWT_REFRESH_SECRET,
        env.JWT_REFRESH_EXPIRY,
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ms(env.JWT_REFRESH_EXPIRY as ms.StringValue),
    });

    return { requires2FA: false, accessToken };
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
        { sub: user.id, role: user.role, type: "access" },
        env.JWT_ACCESS_SECRET,
        env.JWT_ACCESS_EXPIRY,
    );
}

export async function getMe(
    userId: string,
): Promise<Omit<User, "password" | "twoFactorSecret" | "twoFactorBackupCodes">> {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const { password, twoFactorSecret, twoFactorBackupCodes, ...rest } = user;

    return rest;
}

export async function setup2FA(userId: string): Promise<{ qrCode: string }> {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (user.twoFactorEnabled) {
        throw new AppError(409, "Two factor already enabled");
    }

    let secret = user.twoFactorSecret;

    if (!secret) {
        secret = createTotpSecret();

        await userRepository.saveTwoFactorSecret(userId, secret);
    }

    const uri = createTotpUri(secret, user.email);

    const qrCode = await QRCode.toDataURL(uri);

    return { qrCode };
}

export async function verify2FASetup(body: Verify2FASetupInput, userId: string): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (user.twoFactorEnabled) {
        throw new AppError(400, "2FA is already enabled");
    }

    if (!user.twoFactorSecret) {
        throw new AppError(400, "2FA setup has not been started");
    }

    const isValid = await verifyTotp(body.code, user.twoFactorSecret);

    if (!isValid) {
        throw new AppError(400, "Invalid authentication code");
    }

    await userRepository.enableTwoFactor(userId);
}

export async function verify2FA(
    body: Verify2FAInput,
    res: Response,
): Promise<{ requiresTwoFactor: boolean; accessToken: string }> {
    const payload = verify2FAToken(body.twoFactorToken);

    const user = await userRepository.findById(payload.sub);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
        throw new AppError(400, "2FA is not enabled");
    }

    const isValid = await verifyTotp(body.code, user.twoFactorSecret);

    if (!isValid) {
        throw new AppError(401, "Invalid authentication code");
    }

    const accessToken = signToken(
        { sub: user.id, role: user.role, type: "access" },
        env.JWT_ACCESS_SECRET,
        env.JWT_ACCESS_EXPIRY,
    );
    signToken(
        { sub: user.id, role: user.role, type: "refresh" },
        env.JWT_REFRESH_SECRET,
        env.JWT_REFRESH_EXPIRY,
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ms(env.JWT_REFRESH_EXPIRY as ms.StringValue),
    });

    return { requiresTwoFactor: false, accessToken };
}

export async function disable2FA(body: Disable2FAInput, userId: string): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
        throw new AppError(409, "Two factor already disabled");
    }

    const isValid = await verifyTotp(body.code, user.twoFactorSecret);

    if (!isValid) {
        throw new AppError(401, "Invalid authentication code");
    }

    await userRepository.disableTwoFactor(userId);
}
