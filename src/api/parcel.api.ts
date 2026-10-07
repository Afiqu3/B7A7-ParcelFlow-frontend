import apiClient from "@/lib/apiClient";
import { toParcel } from "@/lib/parcel";
import type {
    ApiResponse,
    CreateParcelPayload,
    MyParcelsParams,
    Parcel,
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
