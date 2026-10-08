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
    name: string;
    email: string;
}

export interface AdminParams {
    page?: number; // defaults to 1
    limit?: number; // defaults to 10
    searchTerm?: string;
    sortOrder?: "desc" | "asc";
}
