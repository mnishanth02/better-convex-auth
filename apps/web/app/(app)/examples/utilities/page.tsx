"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { Calculator, Check, CheckCircle2, Clock, Copy, Mail, Shield, Users, X } from "lucide-react";
import { useState } from "react";
import { getUserRole, useSession, useUser } from "@/lib/auth/setup";

// Utility functions (simplified implementations for demo)
function getUserDisplayName(user: unknown): string {
  if (user && typeof user === "object" && "name" in user && typeof user.name === "string") {
    return user.name;
  }
  if (user && typeof user === "object" && "email" in user && typeof user.email === "string") {
    return user.email.split("@")[0] || "User";
  }
  return "User";
}

function getUserInitials(user: unknown): string {
  const displayName = getUserDisplayName(user);
  return (
    displayName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
}

function hasRole(user: unknown, role: string): boolean {
  if (user && typeof user === "object" && "role" in user) {
    return user.role === role;
  }
  return false;
}

function isAdmin(user: unknown): boolean {
  return hasRole(user, "admin");
}

function isModerator(user: unknown): boolean {
  return hasRole(user, "moderator");
}

function hasVerifiedEmail(user: unknown): boolean {
  if (user && typeof user === "object" && "emailVerified" in user) {
    return user.emailVerified === true;
  }
  return false;
}

function isSessionExpired(session: unknown): boolean {
  if (!session || typeof session !== "object") return true;
  if (!("expiresAt" in session)) return true;
  const expiresAt = session.expiresAt;
  if (typeof expiresAt !== "number") return true;
  return Date.now() > expiresAt;
}

interface UtilityDemo {
  id: string;
  title: string;
  description: string;
  category: "user" | "session" | "validation";
  function: string;
  signature: string;
  example: React.ReactNode;
}

export default function UtilitiesDemoPage() {
  const { data: session } = useSession();
  const { user } = useUser();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customName, setCustomName] = useState("John Doe");
  const [customEmail, setCustomEmail] = useState("john.doe@example.com");
  const [customRole, setCustomRole] = useState<"admin" | "moderator" | "user">("user");
  const [testExpiryDate, setTestExpiryDate] = useState(new Date(Date.now() + 3600000).toISOString());

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const utilities: UtilityDemo[] = [
    {
      id: "get-display-name",
      title: "getUserDisplayName()",
      description: "Get a user-friendly display name with fallback logic",
      category: "user",
      function: "getUserDisplayName",
      signature: "(user: User | null) => string",
      example: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Test Name</Label>
              <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Enter name..." />
            </div>
            <div className="space-y-2">
              <Label>Test Email</Label>
              <Input
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="Enter email..."
              />
            </div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Display Name:</span>
              <Badge className="bg-blue-100 text-blue-800">
                {getUserDisplayName({ name: customName, email: customEmail })}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Fallback Logic:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Returns user.name if available</li>
                <li>Returns email username (before @) if name is missing</li>
                <li>Returns &quot;User&quot; as final fallback</li>
              </ol>
            </div>
          </div>
          {user && (
            <div className="rounded-lg border p-3 bg-background">
              <p className="text-sm">
                <span className="font-medium">Your Display Name:</span> {getUserDisplayName(user)}
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "get-initials",
      title: "getUserInitials()",
      description: "Extract user initials for avatars and badges",
      category: "user",
      function: "getUserInitials",
      signature: "(user: User | null) => string",
      example: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Test Name</Label>
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Enter full name..."
            />
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-semibold">
                {getUserInitials({ name: customName })}
              </div>
              <div className="flex-1">
                <p className="font-medium">{customName || "No Name"}</p>
                <p className="text-sm text-muted-foreground">
                  Initials: <code className="font-mono">{getUserInitials({ name: customName })}</code>
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Extraction Logic:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Splits name by spaces</li>
                <li>Takes first letter of first and last word</li>
                <li>Returns up to 2 uppercase letters</li>
                <li>Falls back to first letter if single word</li>
              </ol>
            </div>
          </div>
          {user && (
            <div className="rounded-lg border p-3 bg-background">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-semibold">
                  {getUserInitials(user)}
                </div>
                <p className="text-sm">
                  <span className="font-medium">Your Initials:</span> {getUserInitials(user)}
                </p>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "has-role",
      title: "hasRole()",
      description: "Check if user has a specific role",
      category: "user",
      function: "hasRole",
      signature: "(user: User | null, role: string) => boolean",
      example: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Test Role</Label>
            <div className="flex gap-2">
              <Button
                variant={customRole === "user" ? "default" : "outline"}
                size="sm"
                onClick={() => setCustomRole("user")}
              >
                User
              </Button>
              <Button
                variant={customRole === "moderator" ? "default" : "outline"}
                size="sm"
                onClick={() => setCustomRole("moderator")}
              >
                Moderator
              </Button>
              <Button
                variant={customRole === "admin" ? "default" : "outline"}
                size="sm"
                onClick={() => setCustomRole("admin")}
              >
                Admin
              </Button>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-background">
                {hasRole({ role: customRole }, "admin") ? (
                  <Check className="h-6 w-6 mx-auto text-green-600 mb-1" />
                ) : (
                  <X className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                )}
                <p className="text-xs font-medium">hasRole(&quot;admin&quot;)</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                {hasRole({ role: customRole }, "moderator") ? (
                  <Check className="h-6 w-6 mx-auto text-green-600 mb-1" />
                ) : (
                  <X className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                )}
                <p className="text-xs font-medium">hasRole(&quot;moderator&quot;)</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                {hasRole({ role: customRole }, "user") ? (
                  <Check className="h-6 w-6 mx-auto text-green-600 mb-1" />
                ) : (
                  <X className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                )}
                <p className="text-xs font-medium">hasRole(&quot;user&quot;)</p>
              </div>
            </div>
          </div>
          {user && (
            <div className="rounded-lg border p-3 bg-background">
              <p className="text-sm">
                <span className="font-medium">Your Role:</span> <Badge>{getUserRole(user) || "user"}</Badge>
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "is-admin",
      title: "isAdmin()",
      description: "Quick check if user has admin role",
      category: "user",
      function: "isAdmin",
      signature: "(user: User | null) => boolean",
      example: (
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Admin Check:</span>
              </div>
              {user && isAdmin({ role: getUserRole(user) }) ? (
                <Badge className="bg-green-100 text-green-800">
                  <Check className="mr-1 h-3 w-3" />
                  Is Admin
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <X className="mr-1 h-3 w-3" />
                  Not Admin
                </Badge>
              )}
            </div>
          </div>
          <div className="rounded-lg border p-3 bg-background">
            <p className="text-sm text-muted-foreground">
              Shorthand for: <code className="font-mono">hasRole(user, &quot;admin&quot;)</code>
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "is-moderator",
      title: "isModerator()",
      description: "Quick check if user has moderator role",
      category: "user",
      function: "isModerator",
      signature: "(user: User | null) => boolean",
      example: (
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Moderator Check:</span>
              </div>
              {user && isModerator({ role: getUserRole(user) }) ? (
                <Badge className="bg-green-100 text-green-800">
                  <Check className="mr-1 h-3 w-3" />
                  Is Moderator
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <X className="mr-1 h-3 w-3" />
                  Not Moderator
                </Badge>
              )}
            </div>
          </div>
          <div className="rounded-lg border p-3 bg-background">
            <p className="text-sm text-muted-foreground">
              Shorthand for: <code className="font-mono">hasRole(user, &quot;moderator&quot;)</code>
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "is-email-verified",
      title: "hasVerifiedEmail()",
      description: "Check if user's email is verified",
      category: "validation",
      function: "hasVerifiedEmail",
      signature: "(user: User | null) => boolean",
      example: (
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Email Verification:</span>
              </div>
              {user && hasVerifiedEmail(user) ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">
                  <X className="mr-1 h-3 w-3" />
                  Unverified
                </Badge>
              )}
            </div>
          </div>
          {user && !hasVerifiedEmail(user) && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
              <p className="text-sm text-orange-900">⚠️ Please verify your email to access all features</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "is-session-expired",
      title: "isSessionExpired()",
      description: "Check if a session has expired",
      category: "session",
      function: "isSessionExpired",
      signature: "(session: Session | null) => boolean",
      example: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Test Expiry Date</Label>
            <Input
              type="datetime-local"
              value={testExpiryDate.substring(0, 16)}
              onChange={(e) => setTestExpiryDate(new Date(e.target.value).toISOString())}
            />
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Session Status:</span>
              </div>
              {isSessionExpired({
                user: {
                  id: "test",
                  email: "test@example.com",
                  emailVerified: false,
                  name: "Test",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                session: {
                  id: "test",
                  userId: "test",
                  token: "test",
                  expiresAt: new Date(testExpiryDate),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              }) ? (
                <Badge variant="destructive">
                  <X className="mr-1 h-3 w-3" />
                  Expired
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800">
                  <Check className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              )}
            </div>
            <Separator />
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Expiry:</span> {new Date(testExpiryDate).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Current:</span> {new Date().toLocaleString()}
              </p>
            </div>
          </div>
          {session && (
            <div className="rounded-lg border p-3 bg-background">
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <span className="font-medium">Your Session:</span>
                </p>
                {session && isSessionExpired(session) ? (
                  <Badge variant="destructive">Expired</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                )}
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const code = {
    getUserDisplayName: `import { getUserDisplayName } from "@auth/core";

export default function ProfileHeader() {
  const { user } = useUser();
  
  return (
    <h1>Welcome, {getUserDisplayName(user)}!</h1>
  );
}`,
    getUserInitials: `import { getUserInitials } from "@auth/core";

export default function Avatar() {
  const { user } = useUser();
  
  return (
    <div className="avatar">
      {getUserInitials(user)}
    </div>
  );
}`,
    hasRole: `import { hasRole } from "@auth/core";

export default function Dashboard() {
  const { user } = useUser();
  
  return (
    <div>
      {hasRole(user, "admin") && <AdminPanel />}
      {hasRole(user, "moderator") && <ModTools />}
    </div>
  );
}`,
    isAdmin: `import { isAdmin } from "@auth/core";

export default function SettingsPage() {
  const { user } = useUser();
  
  if (!isAdmin(user)) {
    return <div>Access Denied</div>;
  }
  
  return <AdminSettings />;
}`,
    isModerator: `import { isModerator } from "@auth/core";

export default function ContentModeration() {
  const { user } = useUser();
  
  if (!isModerator(user)) {
    return <div>Access Denied</div>;
  }
  
  return <ModerationQueue />;
}`,
    hasVerifiedEmail: `import { hasVerifiedEmail } from "@auth/core";

export default function ProtectedFeature() {
  const { user } = useUser();
  
  if (!hasVerifiedEmail(user)) {
    return <VerifyEmailBanner />;
  }
  
  return <PremiumContent />;
}`,
    isSessionExpired: `import { isSessionExpired } from "@auth/core";

export default function SessionCheck() {
  const { session } = useSession();
  
  if (isSessionExpired(session)) {
    return <SessionExpiredModal />;
  }
  
  return <DashboardContent />;
}`,
  };

  const filterByCategory = (category: string) => utilities.filter((u) => u.category === category);

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Utility Functions Demo</h1>
        <p className="text-muted-foreground mt-1">
          Interactive demonstrations of @auth/core utility functions with live examples
        </p>
      </div>

      {/* Category Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Utilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filterByCategory("user").length}</div>
            <p className="text-xs text-muted-foreground">functions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Session Utilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filterByCategory("session").length}</div>
            <p className="text-xs text-muted-foreground">functions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Validation Utilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filterByCategory("validation").length}</div>
            <p className="text-xs text-muted-foreground">functions</p>
          </CardContent>
        </Card>
      </div>

      {/* User Utilities */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-bold">User Utilities</h2>
        </div>
        {filterByCategory("user").map((demo) => (
          <Card key={demo.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    {demo.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{demo.description}</CardDescription>
                </div>
                <Badge variant="secondary">{demo.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Live Demo */}
              <div>
                <h3 className="font-semibold mb-3">Interactive Demo</h3>
                {demo.example}
              </div>

              <Separator />

              {/* Code Example */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Usage Example</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(code[demo.function as keyof typeof code], demo.id)}
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
                  <code>{code[demo.function as keyof typeof code]}</code>
                </pre>
              </div>

              {/* Signature */}
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-sm font-semibold mb-1">Function Signature:</p>
                <code className="text-sm font-mono">{demo.signature}</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Session Utilities */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          <h2 className="text-2xl font-bold">Session Utilities</h2>
        </div>
        {filterByCategory("session").map((demo) => (
          <Card key={demo.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    {demo.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{demo.description}</CardDescription>
                </div>
                <Badge variant="secondary">{demo.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Interactive Demo</h3>
                {demo.example}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Usage Example</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(code[demo.function as keyof typeof code], demo.id)}
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
                  <code>{code[demo.function as keyof typeof code]}</code>
                </pre>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-sm font-semibold mb-1">Function Signature:</p>
                <code className="text-sm font-mono">{demo.signature}</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Validation Utilities */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <h2 className="text-2xl font-bold">Validation Utilities</h2>
        </div>
        {filterByCategory("validation").map((demo) => (
          <Card key={demo.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    {demo.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{demo.description}</CardDescription>
                </div>
                <Badge variant="secondary">{demo.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Interactive Demo</h3>
                {demo.example}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Usage Example</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(code[demo.function as keyof typeof code], demo.id)}
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
                  <code>{code[demo.function as keyof typeof code]}</code>
                </pre>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-sm font-semibold mb-1">Function Signature:</p>
                <code className="text-sm font-mono">{demo.signature}</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
          <CardDescription>Import and use utilities in your code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Import Utilities</h3>
            <pre className="rounded-lg border bg-muted p-3 text-sm overflow-x-auto">
              <code>{`import {
  // User utilities
  getUserDisplayName,
  getUserInitials,
  hasRole,
  isAdmin,
  isModerator,
  // Validation utilities
  hasVerifiedEmail,
  // Session utilities
  isSessionExpired,
} from "@auth/core";`}</code>
            </pre>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Common Patterns</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Conditional Rendering by Role:</p>
                <pre className="rounded-lg border bg-muted p-2 text-xs overflow-x-auto">
                  <code>{`{isAdmin(user) && <AdminPanel />}
{isModerator(user) && <ModerationTools />}`}</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Email Verification Guard:</p>
                <pre className="rounded-lg border bg-muted p-2 text-xs overflow-x-auto">
                  <code>{`if (!hasVerifiedEmail(user)) {
  return <VerifyEmailPrompt />;
}`}</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Session Expiry Check:</p>
                <pre className="rounded-lg border bg-muted p-2 text-xs overflow-x-auto">
                  <code>{`if (isSessionExpired(session)) {
  signOut("/auth/login");
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Function Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Function Summary</CardTitle>
          <CardDescription>All available utility functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold">Function</th>
                  <th className="text-left p-3 font-semibold">Category</th>
                  <th className="text-left p-3 font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {utilities.map((util, idx) => (
                  <tr key={util.id} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <td className="p-3">
                      <code className="text-sm font-mono">{util.title}</code>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary" className="text-xs">
                        {util.category}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">{util.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
