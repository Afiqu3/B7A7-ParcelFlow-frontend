import apiClient from "@/lib/apiClient";
import { toParcel } from "@/lib/parcel";
import type {
    ApiResponse,
    cancelParcelPayload,
    CreateParcelPayload,
    MyParcelsParams,
    Parcel,
    ParcelStatusUpdateByAdminPayload,
    ParcelTrackResponse,
    PaymentResponse,
} from "@/types";

export const createParcel = (payload: CreateParcelPayload) => {
    return apiClient("/parcel/create-parcel", {
        method: "POST",
        body: payload,
    });
};

export const getAllMyParcels = async (params: MyParcelsParams) => {
    const res = await apiClient<ApiResponse<Parcel[]>>("/parcel/my-parcels", {
        params,
    });
    return {
        ...res,
        data: Array.isArray(res.data) ? res.data.map(toParcel) : res.data,
    };
};

export const getSingleParcelAsMerchant = async (parcelId: string) => {
    const res = await apiClient<ApiResponse<Parcel>>(
        `parcel/${parcelId}/merchant`,
    );
    return {
        ...res,
        data: res.data ? toParcel(res.data) : res.data,
    };
};

export const cancelParcelByMerchant = (
    parcelId: string,
    payload: cancelParcelPayload,
) => {
    return apiClient(`parcel/${parcelId}/cancel`, {
        method: "POST",
        body: payload,
    });
};

export const deleteParcelByMerchant = (parcelId: string) => {
    return apiClient(`parcel/${parcelId}`, {
        method: "DELETE",
    });
};

export const paymentParcel = (parcelId: string) => {
    return apiClient<ApiResponse<PaymentResponse>>(`parcel/${parcelId}/pay`, {
        method: "POST",
    });
};

export const downloadInvoice = (parcelId: string) => {
    return apiClient<Blob, "blob">(`parcel/${parcelId}/invoice`, {
        responseType: "blob",
    });
};

export const trackParcel = (trackingId: string) => {
    return apiClient<ApiResponse<ParcelTrackResponse>>(
        `parcel/${trackingId}/track`,
    );
};

export const getAllParcels = async (params: MyParcelsParams) => {
    return apiClient<ApiResponse<Parcel[]>>("/parcel", {
        params,
    });
};

export const getSingleParcelAsAdmin = async (parcelId: string) => {
    return apiClient<ApiResponse<Parcel>>(`parcel/${parcelId}`);
};

export const parcelStatusUpdateAdmin = async (
    parcelId: string,
    payload: ParcelStatusUpdateByAdminPayload,
) => {
    return apiClient<ApiResponse<Parcel>>(`parcel/${parcelId}/status`, {
        method: "PATCH",
        body: payload,
    });
};

export const cancelParcelByAdmin = (
    parcelId: string,
    payload: cancelParcelPayload,
) => {
    return apiClient(`parcel/${parcelId}/admin-cancel`, {
        method: "POST",
        body: payload,
    });
};
