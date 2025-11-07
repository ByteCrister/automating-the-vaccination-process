"use client";

import { useState } from "react";
import { api } from "@/lib/axios";
import { Formik, Form, Field, FieldProps } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    name: yup.string().required("Full name is required"),
    password: yup.string().min(6, "At least 6 characters").required("Password is required"),
    otp: yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
});

export default function SignUpForm() {
    const [otpSent, setOtpSent] = useState(false);

    return (
        <Formik
            initialValues={{ email: "", name: "", password: "", otp: "" }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
                setSubmitting(true);
                try {
                    const res = await api.post("/auth/signup", values);
                    const auth = await signIn("credentials", {
                        redirect: false,
                        email: values.email,
                        password: values.password,
                    });
                    if (res.data?.ok && auth?.ok) window.location.href = "/";
                } catch (e: unknown) {
                    if (axios.isAxiosError(e)) {
                        setFieldError("email", e.response?.data?.error || "Error");
                    } else {
                        setFieldError("email", "Something went wrong");
                    }
                }
                setSubmitting(false);
            }}
        >
            {({ isSubmitting, errors, touched, values }) => (
                <Form className="space-y-4">
                    {/* Email */}
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

                    {/* Name */}
                    <div>
                        <Field name="name">
                            {({ field }: FieldProps) => (
                                <Input {...field} type="text" placeholder="Full name" />
                            )}
                        </Field>
                        {errors.name && touched.name && (
                            <div className="text-sm text-red-500 mt-1">{errors.name}</div>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <Field name="password">
                            {({ field }: FieldProps) => (
                                <Input {...field} type="password" placeholder="Password" />
                            )}
                        </Field>
                        {errors.password && touched.password && (
                            <div className="text-sm text-red-500 mt-1">{errors.password}</div>
                        )}
                    </div>

                    {/* OTP + Send Button */}
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
                                    if (!values.email) return alert("Enter email first");
                                    await api.post("/auth/otp/send", {
                                        email: values.email,
                                        purpose: "signup",
                                    });
                                    setOtpSent(true);
                                }}
                            >
                                {otpSent ? "Resend OTP" : "Send OTP"}
                            </Button>
                        </div>
                    </div>

                    {/* Submit */}
                    <div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create account"}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
