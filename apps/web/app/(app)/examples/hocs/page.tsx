/**
 * HOCs Example Page
 *
 * Comprehensive showcase of Higher-Order Components for authentication.
 * Includes interactive demos, code examples, and implementation guidelines.
 */

"use client";

import { useState, type ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible";
import {
  Layers,
  Code,
  Eye,
  ChevronDown,
  ChevronRight,
  Shield,
  User,
  Mail,
  Check,
  X,
  Loader2,
  Info,
  BookOpen,
  Zap,
} from "lucide-react";

// Import HOCs and hooks
import { withAuth, withEmailVerified, useUser, useSession } from "@/lib/auth/setup";
import { generateUniqueId } from "@/lib/utils";

/**
 * Demo Components for HOC Examples
 */

// Base components to wrap with HOCs
function DashboardComponent() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="font-medium">Protected Dashboard</span>
        </div>
        <p className="text-sm text-muted-foreground">This content is only visible to authenticated users.</p>
      </CardContent>
    </Card>
  );
}

function ProfileComponent() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Email Verified Profile</span>
        </div>
        <p className="text-sm text-muted-foreground">This content requires email verification.</p>
      </CardContent>
    </Card>
  );
}

// Create wrapped components
const AuthProtectedDashboard = withAuth(DashboardComponent, {
  redirectTo: "/auth/login",
});

const EmailVerifiedProfile = withEmailVerified(ProfileComponent, {
  redirectTo: "/profile",
});

// For demo purposes, create a simple session display
function SimpleSessionDisplay() {
  const { data: session, isPending } = useSession();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-purple-600" />
            <span className="font-medium">Session Information</span>
          </div>

          {isPending ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading session...
            </div>
          ) : session ? (
            <div className="space-y-1">
              <p className="text-sm">
                <strong>User:</strong> {session.user?.name || "Unknown"}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {session.user?.email || "Unknown"}
              </p>
              <Badge variant="outline" className="text-xs">
                Session Active
              </Badge>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No active session</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Current User Status Component
 */
function UserStatusPanel() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <Card className="border-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading user status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-500">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          Current User Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Authentication:</span>
            {user ? (
              <Badge variant="default" className="text-xs">
                <Check className="h-3 w-3 mr-1" />
                Authenticated
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                <X className="h-3 w-3 mr-1" />
                Not Authenticated
              </Badge>
            )}
          </div>

          {user && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Email Verified:</span>
                {user.emailVerified ? (
                  <Badge variant="default" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Not Verified
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm">
                  <strong>Name:</strong> {user.name || "Not provided"}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            </>
          )}

          {!user && <p className="text-xs text-muted-foreground">Sign in to see HOC behaviors with your session</p>}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * HOC Documentation Section
 */
interface HOCDocProps {
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  usage: string;
  demo: React.ReactNode;
  props: { name: string; type: string; description: string; default?: string }[];
  features: string[];
  vsGuards?: string;
}

function HOCDocumentation({
  name,
  description,
  icon: Icon,
  color,
  usage,
  demo,
  props,
  features,
  vsGuards,
}: HOCDocProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <div className="text-left">
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription className="text-sm mt-1">{description}</CardDescription>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="px-0">
              <Tabs defaultValue="demo" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="demo">
                    <Eye className="h-4 w-4 mr-2" />
                    Demo
                  </TabsTrigger>
                  <TabsTrigger value="code">
                    <Code className="h-4 w-4 mr-2" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="props">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Props
                  </TabsTrigger>
                  <TabsTrigger value="info">
                    <Info className="h-4 w-4 mr-2" />
                    Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="demo" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Live Demo</h4>
                    {demo}
                  </div>
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Usage Example</h4>
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{usage}</code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="props" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Props & Options</h4>
                    <div className="space-y-3">
                      {props.map((prop) => (
                        <div key={prop.name} className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{prop.name}</code>
                            <Badge variant="outline" className="text-xs">
                              {prop.type}
                            </Badge>
                            {prop.default && (
                              <Badge variant="secondary" className="text-xs">
                                default: {prop.default}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{prop.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="info" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {features.map((feature) => (
                        <li key={generateUniqueId()} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {vsGuards && (
                    <div>
                      <h4 className="font-medium mb-2">vs Guards</h4>
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">{vsGuards}</AlertDescription>
                      </Alert>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  );
}

/**
 * Main HOCs Example Page Component
 */
export default function HOCsExamplePage() {
  // HOC configurations for documentation
  const hocs = [
    {
      name: "withAuth",
      description: "Protects components by requiring authentication",
      icon: Shield,
      color: "text-green-600",
      usage: `import { withAuth } from "@/lib/auth/setup";

function DashboardPage() {
  return <div>Protected Content</div>;
}

// Wrap component to require auth
export default withAuth(DashboardPage, {
  redirectTo: "/auth/login"
});

// Or use without options (defaults to /login)
export default withAuth(DashboardPage);`,
      demo: (
        <div className="space-y-4">
          <AuthProtectedDashboard />
          <p className="text-xs text-muted-foreground">
            This component is wrapped with withAuth. It will redirect to login if not authenticated.
          </p>
        </div>
      ),
      props: [
        { name: "Component", type: "ComponentType<P>", description: "Component to wrap and protect" },
        {
          name: "options.redirectTo",
          type: "string",
          description: "URL to redirect to if not authenticated",
          default: "/login",
        },
        {
          name: "options.LoadingComponent",
          type: "ComponentType",
          description: "Custom loading component during auth check",
        },
      ],
      features: [
        "Automatic redirect if not authenticated",
        "Loading state during authentication check",
        "Client-side navigation for better UX",
        "Customizable redirect destination",
        "Type-safe component wrapping",
      ],
      vsGuards:
        "HOCs wrap the entire component and handle redirection, while Guards wrap JSX and can show fallback content.",
    },
    {
      name: "withSession",
      description: "Injects session data as props into components",
      icon: User,
      color: "text-purple-600",
      usage: `import { withSession, type WithSessionProps } from "@/lib/auth/setup";

interface MyComponentProps extends WithSessionProps {
  title: string;
}

function MyComponent({ session, isLoadingSession, title }: MyComponentProps) {
  if (isLoadingSession) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{title}</h1>
      {session ? (
        <p>Welcome, {session.user.name}!</p>
      ) : (
        <p>Guest user</p>
      )}
    </div>
  );
}

export default withSession(MyComponent);`,
      demo: (
        <div className="space-y-4">
          <SimpleSessionDisplay />
          <p className="text-xs text-muted-foreground">
            This component receives session data as props via withSession HOC.
          </p>
        </div>
      ),
      props: [
        {
          name: "Component",
          type: "ComponentType<P & WithSessionProps>",
          description: "Component that expects session props",
        },
        {
          name: "options.LoadingComponent",
          type: "ComponentType",
          description: "Custom loading component while session loads",
        },
        { name: "injected.session", type: "Session | null", description: "Current session data injected as prop" },
        { name: "injected.isLoadingSession", type: "boolean", description: "Whether session is currently loading" },
      ],
      features: [
        "Injects session and loading state as props",
        "Does not require authentication (unlike withAuth)",
        "Useful for components that need session data",
        "Maintains component reusability",
        "Type-safe prop injection",
      ],
      vsGuards: "HOCs inject props into the component, while Guards control what gets rendered based on conditions.",
    },
    {
      name: "withEmailVerified",
      description: "Requires email verification before rendering",
      icon: Mail,
      color: "text-blue-600",
      usage: `import { withEmailVerified } from "@/lib/auth/setup";

function SensitiveDataPage() {
  return <div>Email verified users only</div>;
}

// Wrap to require email verification
export default withEmailVerified(SensitiveDataPage, {
  redirectTo: "/verify-email"
});

// Chain with other HOCs
export default withAuth(withEmailVerified(SensitiveDataPage));`,
      demo: (
        <div className="space-y-4">
          <EmailVerifiedProfile />
          <p className="text-xs text-muted-foreground">
            This component requires both authentication and email verification.
          </p>
        </div>
      ),
      props: [
        { name: "Component", type: "ComponentType<P>", description: "Component to protect with email verification" },
        {
          name: "options.redirectTo",
          type: "string",
          description: "URL to redirect to if email not verified",
          default: "/verify-email",
        },
        {
          name: "options.LoadingComponent",
          type: "ComponentType",
          description: "Custom loading component during verification check",
        },
      ],
      features: [
        "Requires both authentication and email verification",
        "Automatic redirect to verification page",
        "Chainable with other HOCs",
        "Handles loading states gracefully",
        "Customizable verification flow",
      ],
      vsGuards: "HOCs provide automatic redirection, while EmailVerifiedGuard can show custom unauthorized content.",
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Higher-Order Components (HOCs)</h1>
        <p className="text-muted-foreground mt-2">Wrap your components with authentication and session logic</p>
      </div>

      {/* User Status */}
      <UserStatusPanel />

      {/* Info Card */}
      <Card className="border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            What are HOCs?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Higher-Order Components (HOCs) are functions that take a component and return a new enhanced component.
              They're perfect for adding authentication logic to your components without modifying their internal
              implementation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">When to use HOCs:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Component-level protection</li>
                  <li>• Page-level authentication</li>
                  <li>• Automatic redirects</li>
                  <li>• Prop injection patterns</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">When to use Guards instead:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Conditional content rendering</li>
                  <li>• Multiple protection levels</li>
                  <li>• Custom fallback UI</li>
                  <li>• Nested protection patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Comparison */}
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <strong>Quick tip:</strong> HOCs modify the component itself, while Guards wrap JSX content. Use HOCs for
          page-level protection and Guards for conditional UI rendering.
        </AlertDescription>
      </Alert>

      {/* HOCs Documentation */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available HOCs</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Click on any HOC below to explore its features, see live demos, and view implementation examples.
          </p>
        </div>

        {hocs.map((hoc) => (
          <HOCDocumentation key={hoc.name} {...hoc} />
        ))}
      </div>

      {/* Implementation Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Implementation Patterns
          </CardTitle>
          <CardDescription>Common patterns for using HOCs in your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">1. Simple Page Protection</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// pages/dashboard.tsx
import { withAuth } from "@/lib/auth/setup";

function DashboardPage() {
  return <div>Protected dashboard content</div>;
}

export default withAuth(DashboardPage);`}</code>
              </pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">2. Chaining Multiple HOCs</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Chain authentication + email verification
import { withAuth, withEmailVerified } from "@/lib/auth/setup";

function AdminPage() {
  return <div>Admin content for verified users</div>;
}

// Apply HOCs in order: auth first, then email verification
export default withAuth(
  withEmailVerified(AdminPage, { 
    redirectTo: "/verify-email" 
  }),
  { redirectTo: "/login" }
);`}</code>
              </pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">3. Session Prop Injection</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`import { withSession } from "@/lib/auth/setup";

interface HeaderProps {
  title: string;
  session?: any;
  isLoadingSession: boolean;
}

function Header({ session, isLoadingSession, title }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      {isLoadingSession ? (
        <div>Loading...</div>
      ) : session ? (
        <UserMenu user={session.user} />
      ) : (
        <LoginButton />
      )}
    </header>
  );
}

export default withSession(Header);`}</code>
              </pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">4. Custom Loading Components</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`import { withAuth } from "@/lib/auth/setup";
import { Spinner } from "@/components/ui/spinner";

function MyPage() {
  return <div>Protected content</div>;
}

export default withAuth(MyPage, {
  redirectTo: "/auth/signin",
  LoadingComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  )
});`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">✅ Do</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  Use HOCs for page-level protection
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  Chain HOCs in logical order (auth → email → role)
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  Provide custom loading components for better UX
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  Use withSession for components needing session data
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-red-600">❌ Don't</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                  Overuse HOCs for simple conditional rendering
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                  Chain too many HOCs (prefer Guards for complex logic)
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                  Use HOCs for conditional content within components
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                  Forget to handle loading states properly
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-center sm:text-left">
              <h3 className="font-medium">Explore More Authentication Examples</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Learn about other authentication patterns and components
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/examples/guards">Guards</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/examples/hooks">Hooks</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/examples">All Examples</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
