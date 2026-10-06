"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import {
    BadgeCheck,
    ImagePlus,
    Loader2,
    UploadCloud,
    X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
import { useUploadProfileImage } from "@/hooks";
import type { Merchant } from "@/types";
import { formatFileSize } from "@/utils";
import { MAX_FILE_SIZE, profileImageSchema } from "@/validation";
import { initials } from "@/components/dashboard/nav";
import { errorMotion, labelSwapMotion, useShake } from "@/components/form/form-motion";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

// A photo must actually be picked before uploading; the shared schema
// also accepts `null` (used for optional file fields elsewhere).
const uploadSchema = profileImageSchema.refine(
    (value) => value.profileImage instanceof File,
    { message: "Please choose a photo first", path: ["profileImage"] },
);

/** Avatar + photo update card for the merchant profile page. */
export default function ProfileImageCard({ merchant }: { merchant: Merchant }) {
    const [formScope, shakeForm] = useShake<HTMLDivElement>();
    const [preview, setPreview] = useState<string | null>(null);
    const [justUploaded, setJustUploaded] = useState(false);
    const previewRef = useRef<string | null>(null);
    const uploadedFromRef = useRef<string | null>(null);

    const { mutate: upload, isPending } = useUploadProfileImage();

    // Stable identity (only touches a ref + a state setter), so effects
    // can safely depend on it.
    const clearPreview = useCallback(() => {
        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
        setPreview(null);
    }, []);

    // Keep showing the local preview until the refetched profile carries
    // the new `imageUrl`, so the avatar never flashes back to the old one.
    useEffect(() => {
        if (
            preview &&
            justUploaded &&
            merchant.imageUrl &&
            merchant.imageUrl !== uploadedFromRef.current
        ) {
            clearPreview();
            setJustUploaded(false);
        }
    }, [merchant.imageUrl, preview, justUploaded, clearPreview]);

    // Revoke the object URL if the card unmounts mid-preview.
    useEffect(() => {
        return () => {
            if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        };
    }, []);

    const form = useForm({
        defaultValues: {
            profileImage: null as File | null,
        },
        validators: {
            onSubmit: uploadSchema,
        },
        onSubmitInvalid: () => {
            shakeForm();
        },
        onSubmit: ({ value }) => {
            const file = value.profileImage;
            if (!(file instanceof File)) return;
            uploadedFromRef.current = merchant.imageUrl;
            setJustUploaded(false);
            upload(
                { profileImage: file },
                {
                    onSuccess: (res) => {
                        if (
                            res &&
                            typeof res === "object" &&
                            "success" in res &&
                            !res.success
                        ) {
                            shakeForm();
                            toast.error("Could not update photo", {
                                description:
                                    "Something went wrong. Please try again.",
                            });
                            return;
                        }
                        toast.success("Profile photo updated", {
                            description: "Your new photo is now visible.",
                        });
                        form.reset();
                        setJustUploaded(true);
                    },
                    onError: (err: FetchError) => {
                        shakeForm();
                        toast.error("Could not update photo", {
                            description:
                                err.data?.message ||
                                err.message ||
                                "Something went wrong. Please try again.",
                        });
                    },
                },
            );
        },
    });

    const currentSrc = preview ?? merchant.imageUrl;

    return (
        <div
            ref={formScope}
            className="rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
            style={{ animationDelay: "80ms" }}
        >
            <h2 className="font-heading text-sm font-extrabold tracking-tight text-secondary">
                Profile photo
            </h2>
            <p className="mt-1 text-[13px] text-secondary/60">
                PNG or JPG up to {MAX_FILE_SIZE} MB.
            </p>

            <div className="mt-4 flex flex-col items-center text-center">
                <div className="relative">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={currentSrc ?? "fallback"}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {currentSrc ? (
                                <img
                                    src={currentSrc}
                                    alt={`${merchant.name}'s profile photo`}
                                    className="size-28 rounded-3xl object-cover ring-1 ring-secondary/15 sm:size-32"
                                />
                            ) : (
                                <span
                                    role="img"
                                    aria-label={`${merchant.name}'s profile photo placeholder`}
                                    className="grid size-28 place-items-center rounded-3xl bg-brand font-heading text-3xl font-extrabold text-white sm:size-32"
                                >
                                    {initials(merchant.name)}
                                </span>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    {isPending && (
                        <span className="absolute inset-0 grid place-items-center rounded-3xl bg-brand-ink/45">
                            <Spinner className="size-6 text-white" />
                        </span>
                    )}
                </div>

                {justUploaded && !isPending && (
                    <output className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
                        <BadgeCheck className="size-3.5" strokeWidth={2.5} />
                        Photo updated
                    </output>
                )}
            </div>

            <form
                noValidate
                className="mt-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.Field name="profileImage">
                    {(field) => {
                        const file = field.state.value;
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                        const pickFile = (selected: File | null) => {
                            if (!selected) return;
                            const parsed = profileImageSchema.safeParse({
                                profileImage: selected,
                            });
                            if (!parsed.success) {
                                toast.error("Invalid image", {
                                    description: `Please choose a PNG or JPG image under ${MAX_FILE_SIZE} MB.`,
                                });
                                return;
                            }
                            setPreview((old) => {
                                if (old) URL.revokeObjectURL(old);
                                const next = URL.createObjectURL(selected);
                                previewRef.current = next;
                                return next;
                            });
                            field.handleChange(selected);
                        };

                        const removeFile = () => {
                            field.handleChange(null);
                            clearPreview();
                            setJustUploaded(false);
                        };

                        return (
                            <Field data-invalid={isInvalid}>
                                <input
                                    id="profile-photo-input"
                                    type="file"
                                    accept="image/png,image/jpeg"
                                    className="sr-only"
                                    aria-label="Choose a profile photo"
                                    onChange={(e) => {
                                        pickFile(e.target.files?.[0] ?? null);
                                        e.target.value = "";
                                    }}
                                />
                                {!file ? (
                                    <Button
                                        asChild
                                        type="button"
                                        variant="outline"
                                        disabled={isPending}
                                        className="h-10 w-full rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                                    >
                                        <label
                                            htmlFor="profile-photo-input"
                                            className="cursor-pointer"
                                        >
                                            <ImagePlus className="size-4 text-brand-orange" />
                                            Choose photo
                                        </label>
                                    </Button>
                                ) : (
                                    <div className="flex flex-col gap-2.5">
                                        <span className="inline-flex max-w-full items-center gap-2 rounded-xl bg-secondary/5 px-3 py-2 text-left text-sm ring-1 ring-secondary/10 ring-inset">
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate font-semibold text-secondary">
                                                    {file.name}
                                                </span>
                                                <span className="block text-xs text-secondary/60">
                                                    {formatFileSize(file.size)}
                                                </span>
                                            </span>
                                            <button
                                                type="button"
                                                aria-label="Remove selected photo"
                                                onClick={removeFile}
                                                disabled={isPending}
                                                className="grid size-7 shrink-0 place-items-center rounded-lg text-secondary/50 transition-colors outline-none hover:bg-secondary/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-brand-orange/50 disabled:opacity-50"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </span>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={removeFile}
                                                disabled={isPending}
                                                className="h-10 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isPending}
                                                className="h-10 rounded-xl bg-brand-orange px-4 font-heading text-sm font-bold text-brand-ink shadow-[0_12px_28px_-12px_var(--color-brand-orange)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
                                            >
                                                <AnimatePresence
                                                    initial={false}
                                                    mode="popLayout"
                                                >
                                                    {isPending ? (
                                                        <motion.span
                                                            key="pending"
                                                            {...labelSwapMotion}
                                                            className="inline-flex items-center gap-1.5"
                                                        >
                                                            <Loader2 className="size-4 animate-spin" />
                                                            Uploading…
                                                        </motion.span>
                                                    ) : (
                                                        <motion.span
                                                            key="idle"
                                                            {...labelSwapMotion}
                                                            className="inline-flex items-center gap-1.5"
                                                        >
                                                            <UploadCloud className="size-4" />
                                                            Upload
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <AnimatePresence>
                                    {isInvalid && (
                                        <motion.div
                                            key="profile-image-error"
                                            {...errorMotion}
                                            className="overflow-hidden"
                                        >
                                            <FieldError
                                                errors={
                                                    field.state.meta.errors
                                                }
                                                className="mt-2 text-center"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Field>
                        );
                    }}
                </form.Field>
            </form>
        </div>
    );
}
