"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import * as yup from "yup";
import axios from "axios";
import { motion } from "framer-motion";
import clsx from "clsx";
import { api } from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FiMail, FiSend, FiRefreshCw, FiCheck, FiShield } from "react-icons/fi";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { extractErrorMessage } from "@/utils/shakib/extractErrorMessage";

type Step = 1 | 2 | 3;

const schemaEmail = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
});

const schemaOtp = yup.object({
    otp: yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
});

const schemaReset = yup.object({
    newPassword: yup.string().min(6, "At least 6 characters").required("New password is required"),
});

export default function ForgotForm(): JSX.Element {
    const [step, setStep] = useState<Step>(1);
    const [emailForFlow, setEmailForFlow] = useState<string>("");
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const intervalRef = useRef<number | null>(null);

    // Manage cooldown timer lifecycle; setResendCooldown only inside interval callback
    useEffect(() => {
        if (resendCooldown <= 0) {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        if (!intervalRef.current) {
            intervalRef.current = window.setInterval(() => {
                setResendCooldown((c) => {
                    if (c <= 1) {
                        if (intervalRef.current) {
                            window.clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        return 0;
                    }
                    return c - 1;
                });
            }, 1000) as unknown as number;
        }

        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [resendCooldown]);

    async function sendOtp(email: string) {
        setSendingOtp(true);
        try {
            await api.post("/auth/otp/send", { email, purpose: "forgot" });
            setEmailForFlow(email);
            setStep(2);
            setResendCooldown(60);
            toast.success("OTP sent. Check your email.");
        } catch (err: unknown) {
            toast.error(extractErrorMessage(err));
        } finally {
            setSendingOtp(false);
        }
    }

    async function verifyOtp(email: string, otp: string) {
        setVerifyingOtp(true);
        try {
            // adjust verify endpoint as needed
            const res = await api.post("/auth/otp/verify", { email, code: otp, purpose: "forgot" });
            if (res.data?.ok) {
                setStep(3);
                toast.success("OTP verified. Set your new password.");
            } else {
                toast.error("OTP verification failed");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.error || "OTP verification failed");
            } else {
                toast.error("OTP verification failed");
            }
        } finally {
            setVerifyingOtp(false);
        }
    }

    async function submitReset(email: string, otp: string, newPassword: string, setSubmitting: (v: boolean) => void, setFieldError: (k: string, v: string) => void) {
        setSubmitting(true);
        try {
            const res = await api.post("/auth/forgot", { email, otp, newPassword });
            if (res.data?.ok) {
                // try sign in automatically
                const auth = await signIn("credentials", { redirect: false, email, password: newPassword });
                if (auth?.ok) {
                    toast.success("Password reset. Signing in...");
                    window.location.href = "/";
                    return;
                }
                toast.success("Password reset. Please sign in.");
                window.location.href = "/auth/signin";
            } else {
                setFieldError("newPassword", "Reset failed. Check OTP and try again.");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setFieldError("newPassword", err.response?.data?.error || "Reset failed");
            } else {
                setFieldError("newPassword", "Unexpected error");
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-emerald-50 via-white to-emerald-100 p-6">
            <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.996 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.36 }}
                className="w-full max-w-xl"
            >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-2xl p-6">
                    <header className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Reset your password</h1>
                            <p className="mt-1 text-sm text-slate-600">
                                Provide your email first. We&apos;ll send a secure 6-digit code to verify.
                            </p>
                        </div>

                        <div className="hidden sm:flex items-center gap-3 text-slate-500 text-sm">
                            <FiShield className="text-emerald-600" />
                            <div>
                                <div className="font-medium text-slate-700">Secure flow</div>
                                <div className="text-xs text-slate-500">OTP verification</div>
                            </div>
                        </div>
                    </header>

                    {/* Step content */}
                    {step === 1 && (
                        <Formik
                            initialValues={{ email: "" }}
                            validationSchema={schemaEmail}
                            onSubmit={async (values, { setSubmitting }) => {
                                await sendOtp(values.email);
                                setSubmitting(false);
                            }}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form className="space-y-5">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-800 mb-2">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <FiMail />
                                            </span>
                                            <Field name="email">
                                                {({ field }: FieldProps<string>) => (
                                                    <Input {...field} id="email" type="email" placeholder="you@company.com" className="pl-10" aria-label="Email" autoComplete="email" />
                                                )}
                                            </Field>
                                        </div>
                                        {errors.email && touched.email && <div className="text-sm text-red-600 mt-2">{errors.email}</div>}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button type="submit" disabled={isSubmitting || sendingOtp} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white">
                                            <div className="flex items-center gap-2">
                                                <FiSend />
                                                <span>{sendingOtp ? "Sending…" : "Send OTP"}</span>
                                            </div>
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                // optional: let user go back or to sign in
                                                window.location.href = "/auth/signin";
                                            }}
                                        >
                                            Back
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}

                    {step === 2 && (
                        <Formik
                            initialValues={{ otp: "" }}
                            validationSchema={schemaOtp}
                            onSubmit={async (values, { setSubmitting }) => {
                                await verifyOtp(emailForFlow, values.otp);
                                setSubmitting(false);
                            }}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form className="space-y-5">
                                    <div>
                                        <div className="text-sm text-slate-600 mb-2">
                                            We sent a 6-digit code to <span className="font-medium text-slate-800">{emailForFlow}</span>.
                                        </div>

                                        <label htmlFor="otp" className="block text-sm font-medium text-slate-800 mb-2">
                                            One-time code
                                        </label>
                                        <div className="relative">
                                            <Field name="otp">
                                                {({ field }: FieldProps<string>) => (
                                                    <Input {...field} id="otp" type="text" placeholder="123456" inputMode="numeric" className="w-full" aria-label="One-time code" />
                                                )}
                                            </Field>
                                        </div>
                                        {errors.otp && touched.otp && <div className="text-sm text-red-600 mt-2">{errors.otp}</div>}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                                        <div className="sm:col-span-2" />
                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                onClick={async () => {
                                                    if (!emailForFlow) {
                                                        toast.warning("No email stored. Please start again.");
                                                        setStep(1);
                                                        return;
                                                    }
                                                    await sendOtp(emailForFlow);
                                                }}
                                                disabled={sendingOtp || resendCooldown > 0}
                                                className={clsx("w-full", { "opacity-60 cursor-not-allowed": sendingOtp || resendCooldown > 0 })}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FiRefreshCw />
                                                    <span>{resendCooldown > 0 ? `Resend (${resendCooldown}s)` : sendingOtp ? "Sending…" : "Resend"}</span>
                                                </div>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button type="submit" disabled={isSubmitting || verifyingOtp} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white">
                                            <div className="flex items-center gap-2">
                                                <FiCheck />
                                                <span>{verifyingOtp ? "Verifying…" : "Verify OTP"}</span>
                                            </div>
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                // let user edit email again
                                                setStep(1);
                                                setEmailForFlow("");
                                            }}
                                        >
                                            Edit email
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}

                    {step === 3 && (
                        <Formik
                            initialValues={{ newPassword: "", otp: "" }}
                            validationSchema={schemaReset}
                            onSubmit={async (values, { setSubmitting, setFieldError }) => {
                                // reuse the last OTP by asking user to paste; optionally include otp field in UI
                                // here we assume API requires email + otp + newPassword
                                // if otp used earlier is single-use, we should ask OTP again; to keep flow simple, ask user to paste OTP again in this step
                                await submitReset(emailForFlow, values.otp, values.newPassword, setSubmitting, setFieldError);
                            }}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form className="space-y-5">
                                    <div>
                                        <div className="text-sm text-slate-600 mb-2">
                                            Set a new password for <span className="font-medium text-slate-800">{emailForFlow}</span>.
                                        </div>

                                        <label htmlFor="otp" className="block text-sm font-medium text-slate-800 mb-2">
                                            OTP (paste the code you received)
                                        </label>
                                        <Field name="otp">
                                            {({ field }: FieldProps<string>) => (
                                                <Input {...field} id="otp" type="text" placeholder="123456" inputMode="numeric" className="mb-3" />
                                            )}
                                        </Field>

                                        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-800 mb-2">
                                            New password
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Lock size={16} />
                                            </span>
                                            <Field name="newPassword">
                                                {({ field }: FieldProps<string>) => (
                                                    <Input {...field} id="newPassword" type="password" placeholder="Create a strong password" className="pl-10" aria-label="New password" />
                                                )}
                                            </Field>
                                        </div>
                                        {errors.newPassword && touched.newPassword && <div className="text-sm text-red-600 mt-2">{errors.newPassword}</div>}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-900 hover:bg-emerald-800 text-white">
                                            {isSubmitting ? "Resetting…" : <><FiCheck /> Reset password</>}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setStep(1);
                                                setEmailForFlow("");
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
