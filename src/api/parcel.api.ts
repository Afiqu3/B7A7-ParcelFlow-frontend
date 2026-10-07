import apiClient from "@/lib/apiClient";
import type { CreateParcelPayload } from "@/types";

export const createParcel = (payload: CreateParcelPayload) => {
    return apiClient("/parcel/create-parcel", { method: "POST", body: payload });
};