import apiClient from "@/lib/apiClient";
import type { ProfileImagePayload } from "@/types";

export const uploadProfileImage = (payload: ProfileImagePayload) => {
    const formData = new FormData();

    formData.append("profileImage", payload.profileImage);

    return apiClient("/user/profile-image", {
        method: "PATCH",
        body: formData,
    });
};