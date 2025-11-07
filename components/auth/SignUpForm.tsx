"use client";

import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import * as yup from "yup";
import { api } from "@/lib/axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { extractErrorMessage } from "@/utils/shakib/extractErrorMessage";
import { FiMail, FiUser, FiLock, FiCheck, FiRefreshCw } from "react-icons/fi";

type SignupValues = {
    email: string;
    name: string;
    password: string;
    otp: string;
    otpSent: boolean;
};

interface OTPHandler {
    value: string;
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    setAt: (index: number, value: string) => void;
    onPaste: (e: React.ClipboardEvent<Element>, maxLength?: number) => void;
}

interface SignupFieldsProps {
    values: SignupValues;
    setFieldValue: <K extends keyof SignupValues>(
        field: K,
        value: SignupValues[K],
        shouldValidate?: boolean
    ) => void;
    isSubmitting: boolean;
    errors: Partial<Record<keyof SignupValues, string>>;
    touched: Partial<Record<keyof SignupValues, boolean>>;
    otpSent: boolean;
    setOtpSent: React.Dispatch<React.SetStateAction<boolean>>;
    sendingOtp: boolean;
    resendCooldown: number;
    handleSendOtp: (email: string) => Promise<void>;
    otp: OTPHandler;
}

const passwordSchema = yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must include at least one uppercase letter')
    .matches(/[a-z]/, 'Password must include at least one lowercase letter')
    .matches(/\d/, 'Password must include at least one digit')
    .max(128, 'Password is too long');

const schema = yup.object({
    email: yup.string().trim().matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Enter a valid email address').required('Email is required').lowercase(),
    name: yup.string().when('otpSent', { is: true, then: (s) => s.required('Full name is required'), otherwise: (s) => s }),
    password: yup.string().when('otpSent', {
        is: true,
        then: () => passwordSchema,
        otherwise: (s) => s,
    }),
    otp: yup.string().matches(/^\d{6}$/, 'OTP must be 6 digits').when('otpSent', { is: true, then: (s) => s.required('OTP is required'), otherwise: (s) => s }),
});

function useOtpState(length = 6): OTPHandler {
    const [value, setValue] = useState<string>("".padEnd(length, " "));
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    const setAt = (i: number, ch: string) => {
        setValue((prev) => {
            const arr = prev.split("");
            arr[i] = ch || " ";
            return arr.join("");
        });

        if (ch) refs.current[i + 1]?.focus();
        if (!ch && i > 0) refs.current[i - 1]?.focus();
    };

    const onPaste = (e: React.ClipboardEvent<Element>, lengthParam = length) => {
        const text = e.clipboardData
            .getData("text")
            .trim()
            .replace(/\D/g, "")
            .slice(0, lengthParam);
        if (!text) return;
        setValue(text.padEnd(lengthParam, " "));
    };

    return { value, setValue, refs, setAt, onPaste };
}

function passwordScore(pw = "") {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
}

function Stepper({ step }: { step: 1 | 2 }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <div
                    className={clsx(
                        "w-9 h-9 rounded-full flex items-center justify-center text-white",
                        step >= 1 ? "bg-emerald-600" : "bg-emerald-200 text-emerald-600"
                    )}
                >
                    {step > 1 ? <FiCheck /> : 1}
                </div>
                <div className="text-sm text-emerald-700">Account</div>
            </div>

            <div className="flex-1 h-0.5 bg-emerald-100" />

            <div className="flex items-center gap-2">
                <div
                    className={clsx(
                        "w-9 h-9 rounded-full flex items-center justify-center text-white",
                        step >= 2 ? "bg-emerald-600" : "bg-emerald-200 text-emerald-600"
                    )}
                >
                    {step >= 2 ? <FiCheck /> : 2}
                </div>
                <div className="text-sm text-emerald-700">Verify</div>
            </div>
        </div>
    );
}

function SignupFields({
    values,
    setFieldValue,
    isSubmitting,
    errors,
    touched,
    otpSent,
    setOtpSent,
    sendingOtp,
    resendCooldown,
    handleSendOtp,
    otp,
}: SignupFieldsProps) {
    const pwScore = useMemo(() => passwordScore(values.password), [values.password]);

    // derive step from otpSent (avoid storing it in local state to prevent sync issues)
    const activeStep = otpSent ? 2 : 1;

    return (
        <Form className="max-w-md w-full bg-white/60 backdrop-blur rounded-2xl p-6 shadow-xl border border-emerald-50">
            <header className="mb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-emerald-800">Create your account</h2>
                        <p className="text-sm text-emerald-600 mt-1">Secure signup with OTP verification</p>
                    </div>
                </div>
                <div className="mt-4">
                    <Stepper step={activeStep} />
                </div>
            </header>

            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
                {/* Step 1: name, email, password */}
                {activeStep === 1 && (
                    <motion.div
                        key="step-1"
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.99 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-emerald-800 mb-2">Full name</label>
                            <Field name="name">
                                {({ field }: FieldProps<string>) => (
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400">
                                            <FiUser />
                                        </span>
                                        <Input {...field} type="text" placeholder="Your full name" className="pl-10" />
                                    </div>
                                )}
                            </Field>
                            {errors.name && touched.name && <div className="text-sm text-red-600 mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-emerald-800 mb-2">Email</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400">
                                    <FiMail />
                                </span>
                                <Field name="email">
                                    {({ field }: FieldProps<string>) => (
                                        <Input {...field} type="email" placeholder="you@company.com" className="pl-10" />
                                    )}
                                </Field>
                            </div>
                            {errors.email && touched.email && <div className="text-sm text-red-600 mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-emerald-800 mb-2">Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400">
                                    <FiLock />
                                </span>
                                <Field name="password">
                                    {({ field }: FieldProps<string>) => (
                                        <Input {...field} type="password" placeholder="Create a strong password" className="pl-10" />
                                    )}
                                </Field>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${(pwScore / 4) * 100}%` }}
                                        className={clsx("h-2 transition-all", {
                                            "bg-red-500": pwScore <= 1,
                                            "bg-amber-400": pwScore === 2,
                                            "bg-emerald-500": pwScore >= 3,
                                        })}
                                    />
                                </div>
                                <div className="text-xs text-emerald-600 min-w-[74px] text-right">
                                    {["Very weak", "Weak", "Fair", "Good", "Strong"][pwScore] ?? "Very weak"}
                                </div>
                            </div>
                            {errors.password && touched.password && <div className="text-sm text-red-600 mt-1">{errors.password}</div>}
                        </div>

                        <div className="pt-2">
                            <Button
                                type="button"
                                disabled={!values.email || sendingOtp || !values.name || !values.password}
                                onClick={async () => {
                                    if (!values.email) return;
                                    await handleSendOtp(values.email);
                                    // update Formik value only when sending the OTP; avoid synchronous setState in effects
                                    setFieldValue("otpSent", true);
                                    setOtpSent(true);
                                }}
                                className={clsx(
                                    "w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md py-2 transition-colors",
                                    { "opacity-60 cursor-not-allowed": !values.email || sendingOtp }
                                )}
                            >
                                {sendingOtp ? "Sending…" : "Send verification code"}
                            </Button>
                        </div>

                        <div className="text-xs text-emerald-500 mt-2">
                            By continuing you agree to our terms. We&apos;ll send a 6-digit code to this email. Code expires in 1 minutes.
                        </div>
                    </motion.div>
                )}

                {/* Step 2: OTP inputs + submit */}
                {activeStep === 2 && (
                    <motion.div
                        key="step-2"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-emerald-800 mb-2">Enter verification code</label>

                            <div
                                onPaste={(e) => {
                                    otp.onPaste(e, 6);
                                    const pasted = e.clipboardData.getData("text").trim().replace(/\D/g, "").slice(0, 6);
                                    if (pasted.length === 6) {
                                        setFieldValue("otp", pasted);
                                        otp.setValue(pasted.padEnd(6, " "));
                                    }
                                    e.preventDefault();
                                }}
                                className="flex gap-2"
                            >
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => {
                                            if (el) otp.refs.current[i] = el;
                                        }}
                                        value={otp.value[i] === " " ? "" : otp.value[i]}
                                        onChange={(e) => {
                                            const ch = e.target.value.replace(/\D/g, "").slice(-1) || "";
                                            otp.setAt(i, ch);
                                            const arr = otp.value.split("");
                                            arr[i] = ch || " ";
                                            setFieldValue("otp", arr.join("").replace(/\s/g, ""));
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className="w-14 h-14 text-lg font-medium text-center rounded-xl border border-emerald-100 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
                                    />
                                ))}
                            </div>

                            {errors.otp && <div className="text-sm text-red-600 mt-2">{errors.otp}</div>}

                            <div className="flex items-center justify-between mt-3">
                                <div className="text-sm text-emerald-600">Didn&apos;t receive it?</div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={resendCooldown > 0}
                                        onClick={async () => {
                                            if (!values.email) return;
                                            await handleSendOtp(values.email);
                                            setFieldValue("otpSent", true);
                                            setOtpSent(true);
                                        }}
                                        className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
                                    >
                                        <FiRefreshCw className="text-sm" />
                                        {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-emerald-800 mb-2">Confirm details</label>
                            <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FiUser className="text-emerald-500" />
                                        <div>
                                            <div className="font-medium text-emerald-800">{values.name || "—"}</div>
                                            <div className="text-xs">{values.email}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-emerald-600 flex items-center gap-2">
                                        <FiLock />
                                        <span>Hidden</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md py-2 transition-colors"
                            >
                                {isSubmitting ? "Creating…" : <><FiCheck /> Create account</>}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </Form>
    );
}

export default function SignUpForm(): JSX.Element {
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const otp = useOtpState(6);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const id = setInterval(() => setResendCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
        return () => clearInterval(id);
    }, [resendCooldown]);

    async function handleSendOtp(email: string) {
        setSendingOtp(true);
        try {
            await api.post("/auth/otp/send", { email, purpose: "signup" });
            setOtpSent(true);
            setResendCooldown(60);
        } catch (err: unknown) {
            toast.error(extractErrorMessage(err));
        } finally {
            setSendingOtp(false);
        }
    }

    async function submitSignup(values: SignupValues, helpers: FormikHelpers<SignupValues>) {
        helpers.setSubmitting(true);
        try {
            const finalOtp = otp.value.replace(/\s/g, "");
            const payload = {
                email: values.email,
                name: values.name,
                password: values.password,
                otp: finalOtp,
            };
            const res = await api.post("/auth/signup", payload);
            const auth = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            });
            if (res.data?.ok && auth?.ok) window.location.href = "/";
        } catch(e: unknown) {
            helpers.setFieldError("email", "Something went wrong");
            toast.error(extractErrorMessage(e));
        } finally {
            helpers.setSubmitting(false);
        }
    }

    return (
        // Fullscreen center container
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-emerald-50 to-white p-6">
            <Formik initialValues={{ email: "", name: "", password: "", otp: "", otpSent }} validationSchema={schema} onSubmit={submitSignup}>
                {(formikProps) => (
                    <div className="w-full max-w-lg">
                        <SignupFields
                            {...formikProps}
                            otpSent={otpSent}
                            setOtpSent={setOtpSent}
                            sendingOtp={sendingOtp}
                            resendCooldown={resendCooldown}
                            handleSendOtp={handleSendOtp}
                            otp={otp}
                        />
                    </div>
                )}
            </Formik>
        </div>
    );
}