export type UserRole = "user" | "admin";

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
    twoFactorBackupCodes: string | null;
    createdAt: Date;
    updatedAt: Date;
};
