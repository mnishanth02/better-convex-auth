"use client";

import { SessionGuard, SignOutButton, UserAvatar, useUser } from "@/lib/auth/setup";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <SessionGuard>
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
        <div className="flex flex-col items-center gap-4">
          <UserAvatar name={user?.name} email={user?.email} image={user?.image} size="lg" />
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome, {user?.name || "User"}!</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SignOutButton variant="default" showConfirmation={true} redirectTo="/" />
        </div>
      </div>
    </SessionGuard>
  );
}
