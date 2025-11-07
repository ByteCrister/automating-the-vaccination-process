import SignInForm from "@/components/auth/SignInForm";
export default function Page() {
    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
            <SignInForm />
        </div>
    );
}
