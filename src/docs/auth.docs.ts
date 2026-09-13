import { registry } from "../config/swagger.js";
import {
    loginResponseSchema,
    loginUserSchema,
    refreshTokenResponseSchema,
    registerUserSchema,
    sendOtpSchema,
    verifyOtpSchema,
} from "../validations/auth.validation.js";
import {
    errorResponseSchema,
    nullDataSchema,
    successResponseSchema,
} from "../validations/request-response.validation.js";
import { userResponseSchema } from "../validations/user.validation.js";

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
                    schema: errorResponseSchema("Invalid request body"),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Internal server error"),
                },
            },
        },
    },
});

// Verify OTP
registry.registerPath({
    method: "post",
    path: "/auth/register/verify-otp",
    summary: "Verify OTP for registration",
    description:
        "Verifies the OTP against the hashed value stored in Redis. On success, deletes the OTP and marks the email as verified for 10 minutes.",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: verifyOtpSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP verified successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("Otp verified successfully", nullDataSchema),
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
                    schema: errorResponseSchema("Internal server error"),
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
                    schema: errorResponseSchema("Internal server error"),
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
                    schema: errorResponseSchema("Validation error"),
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
                    schema: errorResponseSchema("Internal server error"),
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
                    schema: errorResponseSchema("Internal server error"),
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
                    schema: errorResponseSchema("Internal server error"),
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
            description: "Unauthorized — missing or invalid access token",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Unauthorized"),
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
                    schema: errorResponseSchema("Internal server error"),
                },
            },
        },
    },
});
