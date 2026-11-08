import apiClient from "@/lib/apiClient";
import type { ApiResponse, City, District, Division, LocationParams } from "@/types";

export const getAllDivisions = () => {
    return apiClient<ApiResponse<Division[]>>("/locations/divisions");
};

export const getAllDistricts = (divisionId: string, params: LocationParams) => {
    return apiClient<ApiResponse<District[]>>(
        `/locations/districts?divisionId=${divisionId}`,
        {
            params,
        },
    );
};

export const getAllCities = (districtId: string, params: LocationParams) => {
    return apiClient<ApiResponse<City[]>>(
        `/locations/cities?districtId=${districtId}`,
        {
            params,
        },
    );
};
