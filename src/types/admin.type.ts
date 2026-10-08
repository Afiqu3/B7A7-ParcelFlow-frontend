export interface AdminUpdatePayload {
	name?: string;
}

export interface AdminCreatePayload {
	name: string;
	email: string;
	password: string;
	personalEmail: string;
}
