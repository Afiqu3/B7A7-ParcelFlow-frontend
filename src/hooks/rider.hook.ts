import { applyAsRider } from "@/api";
import { useMutation } from "@tanstack/react-query";

export const useApplyAsRider = () => {
    return useMutation({
        mutationFn: applyAsRider,
    });
};
