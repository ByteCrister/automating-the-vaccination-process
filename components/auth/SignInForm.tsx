"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import * as yup from "yup";
import { signIn, SignInResponse } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { SiGoogle } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const strictEmailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const sixCharPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
const weakPasswords = ["123456", "abcdef", "qwerty", "password", "111111"];

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .matches(strictEmailRegex, "Enter a valid email address")
    .required("Email is required")
    .lowercase(),
  password: yup
    .string()
    .trim()
    .matches(
      sixCharPasswordRegex,
      "Password must be at least 6 characters, include 1 uppercase, 1 lowercase, and 1 digit"
    )
    .notOneOf(weakPasswords, "This password is too common")
    .required("Password is required"),
});

type ErrorCode =
  | "CredentialsSignin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "SessionRequired"
  | "AccessDenied"
  | "Default"
  | string;

function mapNextAuthError(code?: string | null): { title: string; message: string } {
  const c = (code ?? "").toString();
  switch (c) {
    case "CredentialsSignin":
      return { title: "Invalid credentials", message: "Email or password is incorrect." };
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
      return {
        title: "OAuth error",
        message: "There was an issue signing in with your provider. Try again or use another method.",
      };
    case "OAuthAccountNotLinked":
      return {
        title: "Account conflict",
        message: "An account with this email exists. Try signing in using the original provider.",
      };
    case "EmailCreateAccount":
    case "EmailSignin":
      return {
        title: "Email sign in",
        message: "Check your email for a sign-in link or try another method.",
      };
    case "SessionRequired":
      return {
        title: "Session required",
        message: "You must be signed in to access that page.",
      };
    case "AccessDenied":
      return {
        title: "Access denied",
        message: "You do not have permission to sign in with this account.",
      };
    case "Default":
    default:
      return {
        title: "Sign in error",
        message: "Something went wrong while signing in. Please try again.",
      };
  }
}

export default function SignInForm(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlError = searchParams?.get("error") ?? null;

  const [formError, setFormError] = useState<string | null>(null);
  const [globalBanner, setGlobalBanner] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    if (urlError) {
      const mapped = mapNextAuthError(urlError);
      setGlobalBanner(mapped);
    }
  }, [urlError]);

  const initialValues = useMemo(() => ({ email: "", password: "" }), []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-emerald-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.32 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-50 shadow-xl p-6">
          <header className="mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-emerald-800">Welcome back</h1>
                <p className="text-sm text-emerald-600 mt-1">Sign in to continue to your account</p>
              </div>

              <div className="hidden sm:flex items-center text-emerald-500 gap-2 text-sm">
                <FiLogIn />
                <span>Secure sign in</span>
              </div>
            </div>
          </header>

          {globalBanner && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <strong className="block font-medium">{globalBanner.title}</strong>
              <span className="block mt-1">{globalBanner.message}</span>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              setFormError(null);
              try {
                setSubmitting(true);

                const res: SignInResponse | undefined | null = await signIn("credentials", {
                  redirect: false,
                  email: values.email,
                  password: values.password,
                });

                if (!res) {
                  setFormError("Unexpected sign-in response. Try again.");
                  return;
                }

                if (res.error) {
                  // Map the error using mapNextAuthError
                  const mapped = mapNextAuthError(res.error as ErrorCode);

                  // If it’s a credentials error, attach to password field
                  if (res.error === "CredentialsSignin") {
                    setFieldError("password", mapped.message);
                  } else {
                    // Otherwise, show form-level banner
                    setFormError(`${mapped.title}: ${mapped.message}`);
                  }

                  // Update URL query param
                  router.replace(`/signin?error=${encodeURIComponent(res.error)}`);
                  return;
                }

                if (res.ok) {
                  window.location.href = "/";
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (err) {
                setFormError("Unable to sign in. Please try again later.");
              } finally {
                setSubmitting(false);
              }
            }}

          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-emerald-800 mb-2">Email</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400">
                      <FiMail />
                    </span>

                    <Field name="email">
                      {({ field }: FieldProps<string>) => (
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="you@company.com"
                          className="pl-10"
                          aria-label="Email"
                        />
                      )}
                    </Field>
                  </div>

                  {errors.email && touched.email && (
                    <div className="text-sm text-red-600 mt-1">{errors.email}</div>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-emerald-800 mb-2">Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400">
                      <FiLock />
                    </span>

                    <Field name="password">
                      {({ field }: FieldProps<string>) => (
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          placeholder="Your password"
                          className="pl-10"
                          aria-label="Password"
                        />
                      )}
                    </Field>
                  </div>

                  {errors.password && touched.password && (
                    <div className="text-sm text-red-600 mt-1">{errors.password}</div>
                  )}
                </div>

                {/* Form level error (non-field) */}
                {formError && <div className="text-sm text-red-600 mt-1">{formError}</div>}

                {/* Primary actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md py-2 transition-colors"
                    )}
                  >
                    {isSubmitting ? "Signing in…" : <><FiLogIn /> Sign in</>}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // clear any existing error query param before redirecting to provider
                      router.replace("/signin");
                      signIn("google");
                    }}
                    className="flex items-center justify-center gap-2 rounded-md py-2"
                  >
                    <SiGoogle />
                    <span>Sign in with Google</span>
                  </Button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-emerald-600">
                  <Link className="hover:underline" href="/forgot">
                    Forgot password?
                  </Link>

                  <div>
                    <span>New here? </span>
                    <Link className="font-medium text-emerald-700 hover:underline" href="/signup">
                      Create account
                    </Link>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </div>
  );
}
