"use client";

import { useState } from "react";
import { api } from "@/lib/axios";
import { Formik, Form, Field, FieldProps } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    otp: yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
    newPassword: yup.string().min(6, "At least 6 characters").required("New password is required"),
});

export default function ForgotForm() {
    const [otpSent, setOtpSent] = useState(false);

    return (
        <Formik
            initialValues={{ email: "", otp: "", newPassword: "" }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
                setSubmitting(true);
                try {
                    const res = await api.post("/auth/forgot", values);
                    const auth = await signIn("credentials", {
                        redirect: false,
                        email: values.email,
                        password: values.newPassword,
                    });

                    if (res.data?.ok && auth?.ok)
                        window.location.href = "/";

                } catch (e: unknown) {
                    if (axios.isAxiosError(e)) {
                        setFieldError("email", e.response?.data?.error || "Something went wrong");
                    } else {
                        setFieldError("email", "Unexpected error occurred");
                    }
                }
                setSubmitting(false);
            }}
        >
            {({ isSubmitting, errors, touched, values }) => (
                <Form className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <Field name="email">
                            {({ field }: FieldProps) => (
                                <Input {...field} type="email" placeholder="Email" />
                            )}
                        </Field>
                        {errors.email && touched.email && (
                            <div className="text-sm text-red-500 mt-1">{errors.email}</div>
                        )}
                    </div>

                    {/* OTP Field + Send Button */}
                    <div className="flex gap-2 items-center">
                        <div className="flex-1">
                            <Field name="otp">
                                {({ field }: FieldProps) => (
                                    <Input {...field} type="text" placeholder="OTP" />
                                )}
                            </Field>
                            {errors.otp && touched.otp && (
                                <div className="text-sm text-red-500 mt-1">{errors.otp}</div>
                            )}
                        </div>

                        <div>
                            <Button
                                type="button"
                                disabled={!values.email}
                                onClick={async () => {
                                    if (!values.email) {
                                        alert("Enter email first");
                                        return;
                                    }

                                    try {
                                        await api.post("/auth/otp/send", {
                                            email: values.email,
                                            purpose: "forgot",
                                        });
                                        setOtpSent(true);
                                    } catch (e: unknown) {
                                        if (axios.isAxiosError(e)) {
                                            alert(e.response?.data?.error || "Failed to send OTP");
                                        } else {
                                            alert("Something went wrong");
                                        }
                                    }
                                }}
                            >
                                {otpSent ? "Resend OTP" : "Send OTP"}
                            </Button>
                        </div>
                    </div>

                    {/* New Password Field */}
                    <div>
                        <Field name="newPassword">
                            {({ field }: FieldProps) => (
                                <Input {...field} type="password" placeholder="New password" />
                            )}
                        </Field>
                        {errors.newPassword && touched.newPassword && (
                            <div className="text-sm text-red-500 mt-1">{errors.newPassword}</div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Resetting..." : "Reset password"}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
