import { updateAdminProfile } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "./auth.hook";

export const useUpdateAdminProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAdminProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: meQueryOptions.queryKey,
            });
        },
    });
};
