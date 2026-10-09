import type { UserRole, UserStatus } from "./user.type";

export interface Merchant {
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
    merchantProfile: {
        id: string;
        name: string;
        email: string;
        businessName: null | string;
        phone: string;
        isDeleted: boolean;
        deletedAt: null | string;
        createdAt: string;
        updatedAt: string;
        userId: string;
    };
}

export interface MerchantUpdatePayload {
    name?: string;
    phone?: string;
    businessName?: string;
}

export interface MerchantParams {
    status?: UserStatus;
    page?: number; // defaults to 1
    limit?: number; // defaults to 10
    searchTerm?: string;
    sortOrder?: "desc" | "asc";
}
