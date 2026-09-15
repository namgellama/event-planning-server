import { registry } from "@/config/swagger.js";
import {
    disable2FASchema,
    loginResponseSchema,
    loginUserSchema,
    refreshTokenResponseSchema,
    registerUserSchema,
    sendOtpSchema,
    setup2FAResponseSchema,
    verify2FASchema,
    verifyEmailSchema,
} from "@/validations/auth.validation.js";
import {
    authErrorResponseSchema,
    errorResponseSchema,
    internalServerErrorResponseSchema,
    nullDataSchema,
    successResponseSchema,
    validationErrorResponseSchema,
} from "@/validations/request-response.validation.js";
import { userResponseSchema } from "@/validations/user.validation.js";

// Send OTP
registry.registerPath({
    method: "post",
    path: "/auth/register/send-otp",
    summary: "Send OTP for registration",
    description:
        "Generates a 6-digit OTP, stores a hashed version in Redis with a 5-minute expiry, invalidates any previous verification for this email, and emails the OTP to the user.",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: sendOtpSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP sent successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "Otp has been sent to your email",
                        nullDataSchema,
                    ),
                },
            },
        },
        400: {
            description: "Validation error",
            content: {
                "application/json": {
                    schema: validationErrorResponseSchema,
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Verify OTP
registry.registerPath({
    method: "post",
    path: "/auth/register/verify-email",
    summary: "Verify email for registration",
    description:
        "Verifies the email using otp against the hashed value stored in Redis. On success, deletes the OTP and marks the email as verified for 10 minutes.",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: verifyEmailSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Email verified successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("Email verified successfully", nullDataSchema),
                },
            },
        },
        400: {
            description: "Invalid OTP",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Invalid OTP. Please try again"),
                },
            },
        },
        404: {
            description: "OTP expired or not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("OTP expired or not found. Send OTP again"),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Register
registry.registerPath({
    method: "post",
    path: "/auth/register",
    summary: "Register a new user",
    description:
        "Creates a new user account. Requires the email to have been verified via the OTP flow beforehand. Fails if the email is already registered.",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: registerUserSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "User registered successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "User registered successfully",
                        userResponseSchema,
                    ),
                },
            },
        },
        400: {
            description: "Email not verified",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Please verify your email first"),
                },
            },
        },
        409: {
            description: "Email already exists",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Email already exists"),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Login
registry.registerPath({
    method: "post",
    path: "/auth/login",
    summary: "Log in a user",
    description:
        "Authenticates a user by email and password. Sets a refresh token as an httpOnly cookie and also returns both tokens in the response body.",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: loginUserSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "User logged in successfully",
            headers: {
                "Set-Cookie": {
                    schema: {
                        type: "string",
                        example: "refreshToken=eyJhbGci...; Path=/; HttpOnly; SameSite=Lax",
                    },
                    description: "httpOnly refresh token cookie",
                },
            },
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "User logged in successfully",
                        loginResponseSchema,
                    ),
                },
            },
        },
        400: {
            description: "Validation error",
            content: {
                "application/json": {
                    schema: validationErrorResponseSchema,
                },
            },
        },
        401: {
            description: "Invalid credentials",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Invalid credentials"),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Logout
registry.registerPath({
    method: "post",
    path: "/auth/logout",
    summary: "Log out a user",
    description: "Clears the httpOnly refresh token cookie.",
    tags: ["Auth"],
    responses: {
        200: {
            description: "User logged out successfully",
            headers: {
                "Set-Cookie": {
                    schema: {
                        type: "string",
                        example: "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
                    },
                    description: "Clears the refresh token cookie",
                },
            },
            content: {
                "application/json": {
                    schema: successResponseSchema("User logged out successfully", nullDataSchema),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Refresh Token
registry.registerPath({
    method: "post",
    path: "/auth/refresh-token",
    summary: "Refresh access token",
    description:
        "Issues a new access token using the refresh token stored in the httpOnly cookie. Fails if the cookie is missing, invalid/expired, or the user no longer exists.",
    tags: ["Auth"],
    parameters: [
        {
            name: "refreshToken",
            in: "cookie",
            required: true,
            schema: {
                type: "string",
            },
            description: "httpOnly refresh token cookie set at login",
        },
    ],
    responses: {
        200: {
            description: "Token refreshed successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "Token refreshed successfully",
                        refreshTokenResponseSchema,
                    ),
                },
            },
        },
        401: {
            description: "Missing refresh token, invalid/expired token, or user not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("No refresh token found"),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Get current user
registry.registerPath({
    method: "get",
    path: "/auth/me",
    summary: "Get current authenticated user",
    description: "Returns the currently logged-in user's profile, excluding the password.",
    tags: ["Auth"],
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "Current user fetched successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "Current user fetched successfully",
                        userResponseSchema,
                    ),
                },
            },
        },
        401: {
            description: "Not authenticated - no token found",
            content: {
                "application/json": {
                    schema: authErrorResponseSchema,
                },
            },
        },
        404: {
            description: "User not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("User not found"),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// 2FA setup
registry.registerPath({
    method: "post",
    path: "/auth/2fa/setup",
    summary: "Setup 2FA",
    description:
        "Generates a TOTP secret and QR code for the currently authenticated user to configure two-factor authentication.",
    tags: ["Auth"],
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        200: {
            description: "2FA setup initiated successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "2FA setup initiated successfully",
                        setup2FAResponseSchema,
                    ),
                },
            },
        },
        401: {
            description: "Not authenticated - no token found",
            content: {
                "application/json": {
                    schema: authErrorResponseSchema,
                },
            },
        },

        404: {
            description: "User not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("User not found"),
                },
            },
        },

        409: {
            description: "Two-factor authentication is already enabled",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Two factor already enabled"),
                },
            },
        },

        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Verify 2FA setup
registry.registerPath({
    method: "post",
    path: "/auth/2fa/verify-setup",
    summary: "Verify 2FA setup",
    description:
        "Verifies the authenticator code and enables two-factor authentication for the currently logged-in user.",
    tags: ["Auth"],
    security: [
        {
            bearerAuth: [],
        },
    ],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: verify2FASchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "2FA enabled successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("2FA enabled successfully", nullDataSchema),
                },
            },
        },
        400: {
            description:
                "Invalid 2FA request — setup has not been started, 2FA is already enabled, or the authentication code is invalid.",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Invalid authentication code"),
                },
            },
        },
        401: {
            description: "Not authenticated - no token found",
            content: {
                "application/json": {
                    schema: authErrorResponseSchema,
                },
            },
        },

        404: {
            description: "User not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("User not found"),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Verify 2FA
registry.registerPath({
    method: "post",
    path: "/auth/2fa/verify",
    summary: "Verify 2FA",
    description:
        "Verifies the authenticator code using the temporary 2FA token issued during login and returns access and refresh tokens.",
    tags: ["Auth"],
    request: {
        body: {
            required: true,
            content: {
                "application/json": {
                    schema: verify2FASchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "2FA verified successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("2FA verified successfully", verify2FASchema),
                },
            },
        },

        400: {
            description: "2FA is not enabled or the 2FA request is invalid",
            content: {
                "application/json": {
                    schema: errorResponseSchema("2FA is not enabled"),
                },
            },
        },

        401: {
            description: "Invalid or expired 2FA token, or invalid authentication code",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Invalid authentication code"),
                },
            },
        },

        404: {
            description: "User not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("User not found"),
                },
            },
        },

        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Disable 2FA
registry.registerPath({
    method: "post",
    path: "/auth/2fa/disable",
    tags: ["Auth"],
    summary: "Disable two-factor authentication",
    description:
        "Disables two-factor authentication for the authenticated user. The user must provide a valid 6-digit code from their authenticator app.",
    security: [
        {
            bearerAuth: [],
        },
    ],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: disable2FASchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Two-factor authentication disabled successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("2FA disabled successfully", nullDataSchema),
                },
            },
        },

        400: {
            description: "Validation error",
            content: {
                "application/json": {
                    schema: validationErrorResponseSchema,
                },
            },
        },

        401: {
            description: "Unauthorized or invalid two-factor authentication code",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Unauthorized or invalid 2FA code"),
                },
            },
        },

        404: {
            description: "User not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("User not found"),
                },
            },
        },

        409: {
            description: "Two-factor authentication is already disabled",
            content: {
                "application/json": {
                    schema: errorResponseSchema("2FA already disabled"),
                },
            },
        },

        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});
