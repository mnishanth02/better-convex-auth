import { SignInForm } from "@/lib/auth/setup";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignInForm
        redirectTo="/dashboard"
        showSocialAuth={true}
        socialProviders={["github"]}
        signUpUrl="/signup"
        className="w-full max-w-md"
      />
    </div>
  );
}
