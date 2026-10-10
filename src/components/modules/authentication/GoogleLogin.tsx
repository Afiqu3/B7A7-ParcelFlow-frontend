"use client";

import { useGoogleOAuth } from "@/hooks";
import { isGoogleAuthEnabled } from "@/lib/env";
import { ROUTES } from "@/constants";
import { shouldForcePasswordChange } from "@/utils";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { FetchError } from "ofetch";
import { toast } from "sonner";

type googleLoginComponentProps = {
  text: "continue_with" | "signin_with" | "signup_with" | "signin";
  /** Post-login destination (already validated); defaults to home. */
  next?: string;
}

export default function GoogleLoginComponent({ text, next = "/" }: googleLoginComponentProps) {
  const router = useRouter();
  const { mutate: googleLogin } = useGoogleOAuth();

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.error("Google OAuth Failed", {
        description: "Something went wrong. Please try again",
      });
      return;
    }

    googleLogin(
      { idToken },
      {
        onSuccess: async (res) => {
          if (await shouldForcePasswordChange(res)) {
            toast.warning("Password change required", {
              description:
                "Your account is using a temporary password. Please set a new one to continue.",
            });
            router.push(ROUTES.changePassword);
            return;
          }
          toast.success("Logged in Successfully", {
            description: "Welcome back",
          });
          router.push(next);
        },
        onError: (err: FetchError) => {
          toast.error("Authorization failure", {
            description:
              err.data?.message ||
              err.message ||
              "Something went wrong. Please try again",
          });
        },
      },
    );
  };

  const handleGoogleError = () => {
    toast.error("Google OAuth Failed", {
      description: "Something went wrong. Please try again",
    });
  };

  if (!isGoogleAuthEnabled) return null;

  return (
    <GoogleLogin
      theme="outline"
      shape="pill"
      text={text}
      logo_alignment="center"
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
    />
  );
}
