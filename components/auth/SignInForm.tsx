"use client";

import { signIn } from "next-auth/react";
import { Formik, Form, Field, FieldProps } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "At least 6 characters").required("Password is required"),
});

export default function SignInForm() {

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
        setSubmitting(true);

        const res = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        setSubmitting(false);

        if (res?.error) {
          setFieldError("password", "Invalid credentials");
        } else if (res?.ok) {
          window.location.href = "/";
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-4">
          {/* Email Field */}
          <div>
            <Field name="email">
              {({ field }: FieldProps) => (
                <Input {...field} type="email" placeholder="you@company.com" />
              )}
            </Field>
            {errors.email && touched.email && (
              <div className="text-sm text-red-500 mt-1">{errors.email}</div>
            )}
          </div>

          {/* Password Field */}
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

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => signIn("google")}
            >
              Sign in with Google
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
