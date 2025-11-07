import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-6 max-w-md text-center">
        <h1 className="text-4xl font-bold">Better Convex Auth</h1>
        <p className="text-muted-foreground">A modern authentication system built with Better Auth and Convex</p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
        <div className="mt-4">
          <Button asChild variant="link">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
