"use client";

import { useGoogleOAuth } from "@/hooks";
import { isGoogleAuthEnabled } from "@/lib/env";
import { completePasswordLogin } from "@/utils";
import { GoogleLogin } from "@react-oauth/google";
import type { FetchError } from "ofetch";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type googleLoginComponentProps = {
  text: "continue_with" | "signin_with" | "signup_with" | "signin";
  /** Post-login destination (already validated); defaults to home. */
  next?: string;
  fullWidth?: boolean;
}

export default function GoogleLoginComponent({
  text,
  next = "/",
  fullWidth = false,
}: googleLoginComponentProps) {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number | null>(null);
  const { mutate: googleLogin } = useGoogleOAuth();

  useEffect(() => {
    if (!fullWidth || !buttonContainerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width);
      if (width > 0) {
        setButtonWidth((currentWidth) =>
          currentWidth === width ? currentWidth : width,
        );
      }
    });

    observer.observe(buttonContainerRef.current);
    return () => observer.disconnect();
  }, [fullWidth]);

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
    <div
      ref={buttonContainerRef}
      className={fullWidth ? "min-h-10 w-full" : undefined}
    >
      {(!fullWidth || buttonWidth !== null) && (
        <GoogleLogin
          theme="outline"
          shape="pill"
          text={text}
          logo_alignment="center"
          width={fullWidth ? String(buttonWidth) : undefined}
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      )}
    </div>
  );
}
