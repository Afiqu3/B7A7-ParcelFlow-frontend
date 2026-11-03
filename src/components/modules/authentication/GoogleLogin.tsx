"use client";

import { useGoogleOAuth } from "@/hooks";
import { isGoogleAuthEnabled } from "@/lib/env";
import { completePasswordLogin } from "@/utils";
import { GoogleLogin } from "@react-oauth/google";
import type { FetchError } from "ofetch";
import { toast } from "sonner";

type googleLoginComponentProps = {
  text: "continue_with" | "signin_with" | "signup_with" | "signin";
  /** Post-login destination (already validated); defaults to home. */
  next?: string;
}

export default function GoogleLoginComponent({ text, next = "/" }: googleLoginComponentProps) {
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
          await completePasswordLogin(res, {
            push: (url) => window.location.replace(url),
            next,
          });
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
