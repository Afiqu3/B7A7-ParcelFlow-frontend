import { createAssignment } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["available-riders"],
            });
        },
    });
};
