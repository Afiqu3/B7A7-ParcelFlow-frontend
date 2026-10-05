import { applyAsRider, verifyRiderAccount } from "@/api";
import { useMutation } from "@tanstack/react-query";

export const useApplyAsRider = () => {
    return useMutation({
        mutationFn: applyAsRider,
    });
};

export const useVerifyRiderAccount = () => {
    return useMutation({
        mutationFn: verifyRiderAccount,
    });
};
