import { getAllCities, getAllDistricts, getAllDivisions } from "@/api";
import type { LocationParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetAllDivisions = () => {
    return useQuery({
        queryKey: ["divisions"],
        queryFn: getAllDivisions,
    });
};

export const useGetAllDistricts = (
    divisionId: string,
    params: LocationParams,
) => {
    return useQuery({
        queryKey: ["districts", divisionId, params],
        queryFn: () => getAllDistricts(divisionId, params),
        enabled: Boolean(divisionId),
    });
};

export const useGetAllCities = (
    districtId: string,
    params: LocationParams,
) => {
    return useQuery({
        queryKey: ["cities", districtId, params],
        queryFn: () => getAllCities(districtId, params),
        enabled: Boolean(districtId),
    });
};
