export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MERCHANT" | "RIDER";

export type UserStatus = "ACTIVE" | "BLOCKED";

export interface User {
    id: string;
    name: string;
    email: string;
    googleId: null | string;
    authProvider: string;
    emailVerified: boolean;
    role: UserRole;
    status: UserStatus;
    mustChangePassword: boolean;
    imageUrl: null | string;
    imagePublicId: null | string;
    isDeleted: boolean;
    deletedAt: null | string;
    createdAt: string;
    updatedAt: string;
}

export interface ProfileImagePayload {
    profileImage: File;
}
