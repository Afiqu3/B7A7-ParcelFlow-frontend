import { createParcel } from "@/api";
import { useMutation } from "@tanstack/react-query";

export const useCreateParcel = () => {
    return useMutation({
        mutationFn: createParcel,
    });
};
