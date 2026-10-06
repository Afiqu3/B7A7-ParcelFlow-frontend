import z from "zod";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_BYTES } from "./rider.validation";

export const ACCEPTED_FILE_TYPEs_IMAGE = ["image/png", "image/jpeg"];

export const isAcceptedFileSizeImage = (fileSize: number) => {
    return fileSize <= MAX_FILE_SIZE_BYTES;
};

export const isAcceptedFileTypeImage = (fileType: string) => {
    return ACCEPTED_FILE_TYPEs_IMAGE.includes(fileType);
};

export const getCustomFileSchemaImage = <T>(message: string) =>
    z.custom<T>(
        (value) =>
            value === null ||
            (value instanceof File &&
                isAcceptedFileSizeImage(value.size) &&
                isAcceptedFileTypeImage(value.type)),
        {
            message: message,
        },
    );

export const profileImageSchema = z.object({
    profileImage: getCustomFileSchemaImage<File | null>(
        `Profile Image must be an image file under ${MAX_FILE_SIZE}MB`,
    ),
});
