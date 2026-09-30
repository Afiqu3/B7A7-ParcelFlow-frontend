export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterMerchantPayload {
	id: string;
	name: string;
	email: string;
	password: string;
	merchantProfile?: IMerchantProfile;
}

interface IMerchantProfile {
	businessName?: string;
	phone: string;
}
