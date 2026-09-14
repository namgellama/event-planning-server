import { generateSecret, generateURI, verify } from "otplib";

export function createTotpSecret() {
    return generateSecret();
}

export function createTotpUri(secret: string, email: string, issuer = "Gather") {
    return generateURI({
        issuer,
        label: email,
        secret,
    });
}

export async function verifyTotp(token: string, secret: string) {
    const result = await verify({
        token,
        secret,
    });

    return result.valid;
}
