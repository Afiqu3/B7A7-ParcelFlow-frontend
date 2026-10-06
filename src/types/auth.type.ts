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

export interface VerifyEmailPayload {
    email: string;
    otp: string;
}

export interface ResetPasswordPayload {
    email: string;
    newPassword: string;
    otp: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}
