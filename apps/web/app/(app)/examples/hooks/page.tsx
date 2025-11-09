/** biome-ignore-all lint/suspicious/noCommentText: <false positive> */
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { useSession, useUser, useSignOut, UserAvatar, getUserRole } from "@/lib/auth/setup";
import {
  Code,
  Copy,
  CheckCircle2,
  User,
  Shield,
  RefreshCw,
  LogOut,
  Database,
  Clock,
  Mail,
  Calendar,
} from "lucide-react";

interface HookDemo {
  id: string;
  title: string;
  description: string;
  hook: string;
  usage: string;
  returnValue: string;
  example: React.ReactNode;
}

export default function HooksDemoPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const { user, isLoading: userLoading } = useUser();
  const { signOut } = useSignOut();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customSignInEmail, setCustomSignInEmail] = useState("");
  const [customSignInPassword, setCustomSignInPassword] = useState("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date));
  };

  const hooks: HookDemo[] = [
    {
      id: "use-session",
      title: "useSession()",
      description: "Access current session data with loading state",
      hook: "useSession",
      usage: "const { data: session, isPending } = useSession();",
      returnValue: "{ data: Session | null, isPending: boolean }",
      example: (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Current Session</h3>
            {sessionLoading && <Badge variant="secondary">Loading...</Badge>}
          </div>

          {session ? (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Session ID</p>
                  <code className="text-xs font-mono">{session.session?.id?.substring(0, 12) || "N/A"}...</code>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="text-xs">{formatDate(session.session?.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expires</p>
                  <p className="text-xs">{formatDate(session.session?.expiresAt)}</p>
                </div>
              </div>
              <Separator />
              <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
                {JSON.stringify(
                  {
                    id: session.session?.id,
                    userId: session.user?.id,
                    expiresAt: session.session?.expiresAt,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">No active session</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "use-user",
      title: "useUser()",
      description: "Get current user information and profile data",
      hook: "useUser",
      usage: "const { user, isLoading } = useUser();",
      returnValue: "{ user: User | null, isLoading: boolean }",
      example: (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Current User</h3>
            {userLoading && <Badge variant="secondary">Loading...</Badge>}
          </div>

          {user ? (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
              <div className="flex items-start gap-4">
                <UserAvatar size="lg" />
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="font-semibold">{user.name || "No name"}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                      {user.emailVerified && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getUserRole(user) && <Badge className="bg-purple-100 text-purple-800">{getUserRole(user)}</Badge>}
                    {user.emailVerified ? (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-800">Unverified</Badge>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <code className="text-xs font-mono">{user.id?.substring(0, 12)}...</code>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    {formatDate(user.createdAt)}
                  </div>
                </div>
              </div>
              <Separator />
              <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
                {JSON.stringify(
                  {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    role: getUserRole(user),
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">No user data available</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "use-sign-out",
      title: "useSignOut()",
      description: "Sign out with optional redirect",
      hook: "useSignOut",
      usage: "const { signOut, isLoading } = useSignOut();",
      returnValue: "{ signOut: (redirectTo?: string) => Promise<void>, isLoading: boolean }",
      example: (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">Sign Out Actions</h3>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Sign out actions:</p>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={() => signOut()} size="sm">
                  <LogOut className="mr-2 h-3 w-3" />
                  Sign Out Now
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Usage Examples:</p>
              <div className="space-y-2">
                <div className="bg-background p-2 rounded border text-xs">
                  <code>signOut() // Signs out, default redirect</code>
                </div>
                <div className="bg-background p-2 rounded border text-xs">
                  <code>signOut(&quot;/auth/login&quot;) // Signs out, redirects to login</code>
                </div>
                <div className="bg-background p-2 rounded border text-xs">
                  <code>signOut(&quot;/&quot;) // Signs out, redirects to home</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const code = {
    useSession: `import { useSession } from "@auth/web";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;

  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Session expires: {session.expiresAt}</p>
    </div>
  );
}`,
    useUser: `import { useUser } from "@auth/web";

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!user) return <div>Not authenticated</div>;
  
  return (
    <div>
      <h1>Hello, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {user.emailVerified && <span>✓ Verified</span>}
    </div>
  );
}`,
    useSignIn: `import { useSignIn } from "@auth/web";
import { useState } from "react";

export default function CustomSignInForm() {
  const { signIn, isLoading, error } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(
      { email, password },
      { redirectTo: "/dashboard" }
    );
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}`,
    useSignUp: `import { useSignUp } from "@auth/web";
import { useState } from "react";

export default function CustomSignUpForm() {
  const { signUp, isLoading, error } = useSignUp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(
      { name, email, password },
      { redirectTo: "/dashboard" }
    );
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}`,
    useSignOut: `import { useSignOut } from "@auth/web";

export default function Header() {
  const { signOut, isLoading } = useSignOut();
  
  return (
    <button 
      onClick={() => signOut("/auth/login")}
      disabled={isLoading}
    >
      {isLoading ? "Signing out..." : "Sign Out"}
    </button>
  );
}`,
  };

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Hooks Demo</h1>
        <p className="text-muted-foreground mt-1">
          Live demonstrations of @auth/web hooks with real-time data and interactive examples
        </p>
      </div>

      {/* Live Hook Demos */}
      <div className="space-y-6">
        {hooks.map((demo) => (
          <Card key={demo.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    {demo.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{demo.description}</CardDescription>
                </div>
                <Badge variant="secondary">@auth/web</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Live Example */}
              <div>
                <h3 className="font-semibold mb-3">Live Demo</h3>
                {demo.example}
              </div>

              <Separator />

              {/* Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Usage</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(code[demo.hook as keyof typeof code], demo.id)}
                  >
                    {copiedId === demo.id ? (
                      <>
                        <CheckCircle2 className="mr-2 h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-3 w-3" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <pre className="rounded-lg border bg-muted p-4 overflow-x-auto text-sm">
                  <code>{code[demo.hook as keyof typeof code]}</code>
                </pre>
              </div>

              {/* Return Value */}
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-sm font-semibold mb-1">Return Value:</p>
                <code className="text-sm font-mono">{demo.returnValue}</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Sign-In Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            useSignIn() - Custom Implementation
          </CardTitle>
          <CardDescription>Build your own sign-in form using the useSignIn hook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Custom sign in:", { customSignInEmail, customSignInPassword });
              }}
              className="space-y-4 max-w-md"
            >
              <div className="space-y-2">
                <Label htmlFor="custom-email">Email</Label>
                <Input
                  id="custom-email"
                  type="email"
                  placeholder="user@example.com"
                  value={customSignInEmail}
                  onChange={(e) => setCustomSignInEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-password">Password</Label>
                <Input
                  id="custom-password"
                  type="password"
                  placeholder="••••••••"
                  value={customSignInPassword}
                  onChange={(e) => setCustomSignInPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In (Demo)
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                This is a demo form. Check the code example below.
              </p>
            </form>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Implementation Code</h3>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(code.useSignIn, "custom-signin")}>
                {copiedId === "custom-signin" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-3 w-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-3 w-3" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <pre className="rounded-lg border bg-muted p-4 overflow-x-auto text-sm">
              <code>{code.useSignIn}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
          <CardDescription>Common patterns and best practices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Import Hooks</h3>
            <pre className="rounded-lg border bg-muted p-3 text-sm">
              <code>{`import { useSession, useUser, useSignIn, useSignUp, useSignOut } from "@auth/web";`}</code>
            </pre>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Protected Component Pattern</h3>
            <pre className="rounded-lg border bg-muted p-3 text-sm overflow-x-auto">
              <code>{`export default function ProtectedPage() {
  const { user, isLoading } = useUser();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Redirect to="/auth/login" />;
  
  return <div>Hello {user.name}!</div>;
}`}</code>
            </pre>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Conditional Rendering by Role</h3>
            <pre className="rounded-lg border bg-muted p-3 text-sm overflow-x-auto">
              <code>{`export default function Dashboard() {
  const { user } = useUser();
  
  return (
    <div>
      <h1>Dashboard</h1>
      {user?.role === "admin" && <AdminPanel />}
      {user?.role === "moderator" && <ModeratorTools />}
    </div>
  );
}`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Hook Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Hook Comparison</CardTitle>
          <CardDescription>When to use each hook</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold">Hook</th>
                  <th className="text-left p-3 font-semibold">Use Case</th>
                  <th className="text-left p-3 font-semibold">Returns</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">
                    <code className="text-sm font-mono">useSession()</code>
                  </td>
                  <td className="p-3 text-sm">Access session data, check expiration</td>
                  <td className="p-3 text-sm">Session object with metadata</td>
                </tr>
                <tr className="border-t bg-muted/30">
                  <td className="p-3">
                    <code className="text-sm font-mono">useUser()</code>
                  </td>
                  <td className="p-3 text-sm">Get user profile, check roles & verification</td>
                  <td className="p-3 text-sm">User object with profile data</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">
                    <code className="text-sm font-mono">useSignIn()</code>
                  </td>
                  <td className="p-3 text-sm">Build custom sign-in forms</td>
                  <td className="p-3 text-sm">signIn function + loading/error</td>
                </tr>
                <tr className="border-t bg-muted/30">
                  <td className="p-3">
                    <code className="text-sm font-mono">useSignUp()</code>
                  </td>
                  <td className="p-3 text-sm">Build custom sign-up forms</td>
                  <td className="p-3 text-sm">signUp function + loading/error</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">
                    <code className="text-sm font-mono">useSignOut()</code>
                  </td>
                  <td className="p-3 text-sm">Sign out with redirect control</td>
                  <td className="p-3 text-sm">signOut function + loading state</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
