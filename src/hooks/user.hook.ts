import { uploadProfileImage } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "./auth.hook";

export const useUploadProfileImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadProfileImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["merchant"] });
            queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey });
        },
    });
};
