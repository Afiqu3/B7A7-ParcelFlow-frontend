import type { UserStatus } from "./user.type";

export interface AdminUpdatePayload {
	name?: string;
}

export interface AdminCreatePayload {
	name: string;
	email: string;
	password: string;
	personalEmail: string;
}

export interface Admin {
    id: string;
    name: string;
    email: string;
    /** Present when the backend includes it; the toggle works regardless. */
    status?: UserStatus;
}

export interface AdminParams {
    page?: number; // defaults to 1
    limit?: number; // defaults to 10
    searchTerm?: string;
    sortOrder?: "desc" | "asc";
}
