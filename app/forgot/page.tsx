import ForgotForm from "@/components/auth/ForgotForm";

export default function Page() {
    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Reset your password</h1>
            <ForgotForm />
        </div>
    );
}
