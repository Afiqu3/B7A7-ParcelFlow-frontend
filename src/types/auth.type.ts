export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterMerchantPayload {
	name: string;
	email: string;
	password: string;
	merchantProfile?: IMerchantProfile;
}

interface IMerchantProfile {
	businessName?: string;
	phone: string;
}
