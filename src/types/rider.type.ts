import type { User, UserRole, UserStatus } from "./user.type";

export type VehicleType = "BIKE" | "BICYCLE" | "VAN";

export interface ApplyAsRiderData {
    user: {
        name: string;
        email: string;
    };
    riderProfile: {
        phone: string;
        address?: string;
        nid: string;
        licenseNumber: string;
        vehicleType: VehicleType;
    };
}

export interface ApplyAsRiderPayload {
    vehiclePaper: File;
    data: ApplyAsRiderData;
}

export type RiderApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Rider {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    nid: string;
    licenseNumber: string;
    vehicleType: string;
    vehiclePaper: string;
    applicationStatus: RiderApplicationStatus;
    reviewedById?: string;
    reviewedAt?: string;
    rejectionReason?: string;
    isDeleted: boolean;
    deletedAt?: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    user: User;
}

export interface RiderParams {
    applicationStatus?: RiderApplicationStatus;
    page?: number; // defaults to 1
    limit?: number; // defaults to 10
    searchTerm?: string;
    sortOrder?: "desc" | "asc";
}

export interface AvailableRiderParams {
    page?: number; // defaults to 1
    limit?: number; // defaults to 10
    searchTerm?: string;
    sortOrder?: "desc" | "asc";
}

export interface ApproveRiderPayload {
    riderId: string;
    applicationStatus: RiderApplicationStatus;
    rejectionReason?: string;
}

export interface RiderProfileData {
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
    riderProfile: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        nid: string;
        licenseNumber: string;
        vehicleType: VehicleType;
        vehiclePaper: string;
        reviewedById: string;
        reviewedAt: string;
        rejectionReason?: string;
        vehiclePaperPublicId: string;
        isDeleted: boolean;
        deletedAt: null | string;
        createdAt: string;
        updatedAt: string;
        userId: string;
    };
}

export interface RiderUpdatePayload {
	name?: string;
	phone?: string;
	address?: string;
}
