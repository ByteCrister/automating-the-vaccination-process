import SignUpForm from "@/components/auth/SignUpForm";

export default function Page() {
    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
            <SignUpForm />
        </div>
    );
}
