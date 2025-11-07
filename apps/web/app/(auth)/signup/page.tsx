import { SignUpForm } from "@/lib/auth/setup";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignUpForm
        redirectTo="/dashboard"
        showSocialAuth={true}
        socialProviders={["github"]}
        signInUrl="/login"
        className="w-full max-w-md"
      />
    </div>
  );
}
