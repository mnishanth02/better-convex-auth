/**
 * Error Handling Example Page
 *
 * Comprehensive demonstration of error handling patterns with error boundaries,
 * auth errors, network errors, and recovery strategies.
 */

"use client";

import { useState, useEffect, type ComponentType, type ErrorInfo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Code,
  Eye,
  Info,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
  Shield,
  ShieldX,
  User,
  UserX,
  Zap,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

// Import auth hooks
import { useUser, useSession } from "@/lib/auth/setup";
import React from "react";

/**
 * Error Boundary Component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; reset: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={() => this.setState({ hasError: false, error: undefined })}
          />
        );
      }

      return (
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">An error occurred while rendering this component.</p>
            {this.state.error && (
              <div className="space-y-2">
                <p className="text-sm font-mono bg-muted p-2 rounded">{this.state.error.message}</p>
                <Button
                  onClick={() => this.setState({ hasError: false, error: undefined })}
                  size="sm"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Demo Components for Error Scenarios
 */
function CrashingComponent() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error("Demo component crashed intentionally!");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Component Error Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          This component will throw an error when you click the button.
        </p>
        <Button onClick={() => setShouldCrash(true)} variant="destructive" size="sm">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Trigger Error
        </Button>
      </CardContent>
    </Card>
  );
}

function NetworkErrorDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const simulateNetworkError = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Randomly fail to simulate network issues
      if (Math.random() > 0.5) {
        throw new Error("Network request failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const retry = () => {
    setError(null);
    setSuccess(false);
    simulateNetworkError();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          Network Error Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">Simulates network failures with automatic retry functionality.</p>

        {error && (
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button onClick={retry} size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>Request completed successfully!</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button onClick={simulateNetworkError} disabled={isLoading} size="sm">
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                Loading...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Make Request
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AuthErrorDemo() {
  const { user } = useUser();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateAuthError = async (errorType: string) => {
    setIsSimulating(true);
    setAuthError(null);

    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (errorType) {
      case "session_expired":
        setAuthError("Your session has expired. Please sign in again.");
        break;
      case "insufficient_permissions":
        setAuthError("You don't have permission to access this resource.");
        break;
      case "account_locked":
        setAuthError("Your account has been temporarily locked due to multiple failed attempts.");
        break;
      case "email_not_verified":
        setAuthError("Please verify your email address before continuing.");
        break;
      default:
        setAuthError("An authentication error occurred.");
    }

    setIsSimulating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Authentication Error Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium">Current Status:</span>
          {user ? (
            <Badge variant="default" className="text-xs">
              <User className="h-3 w-3 mr-1" />
              Authenticated
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              <UserX className="h-3 w-3 mr-1" />
              Not Authenticated
            </Badge>
          )}
        </div>

        {authError && (
          <Alert variant="destructive">
            <ShieldX className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{authError}</span>
              <Button onClick={() => setAuthError(null)} size="sm" variant="outline">
                <X className="h-4 w-4 mr-2" />
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-muted-foreground">
          Simulate different authentication errors and see how they're handled.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => simulateAuthError("session_expired")}
            disabled={isSimulating}
            size="sm"
            variant="outline"
          >
            Session Expired
          </Button>
          <Button
            onClick={() => simulateAuthError("insufficient_permissions")}
            disabled={isSimulating}
            size="sm"
            variant="outline"
          >
            No Permission
          </Button>
          <Button
            onClick={() => simulateAuthError("account_locked")}
            disabled={isSimulating}
            size="sm"
            variant="outline"
          >
            Account Locked
          </Button>
          <Button
            onClick={() => simulateAuthError("email_not_verified")}
            disabled={isSimulating}
            size="sm"
            variant="outline"
          >
            Email Not Verified
          </Button>
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
  const { data: session } = useSession();

  if (isLoading) {
    return (
      <Card className="border-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
                <span className="text-sm font-medium">Session:</span>
                {session ? (
                  <Badge variant="default" className="text-xs">
                    Active Session
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    No Session
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

          {!user && (
            <p className="text-xs text-muted-foreground">
              Errors will be simulated - no actual authentication required
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Error Documentation Interface
 */
interface ErrorDocProps {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  component: React.ReactNode;
  errorTypes: string[];
  handlingStrategies: string[];
  recoveryOptions: string[];
  implementation: string;
  bestPractices: string[];
}

/**
 * Error Documentation Component
 */
function ErrorDocumentation({
  id,
  name,
  description,
  icon: Icon,
  color,
  component,
  errorTypes,
  handlingStrategies,
  recoveryOptions,
  implementation,
  bestPractices,
}: ErrorDocProps) {
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
                  <TabsTrigger value="strategies">
                    <Shield className="h-4 w-4 mr-2" />
                    Strategies
                  </TabsTrigger>
                  <TabsTrigger value="practices">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Best Practices
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="demo" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Live Demo</h4>
                    <div className="border rounded-lg p-4 bg-muted/20">{component}</div>
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Error Types Covered:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {errorTypes.map((type) => (
                          <div key={type} className="flex items-center gap-2 text-xs">
                            <AlertTriangle className="h-3 w-3 text-orange-600 shrink-0" />
                            <span>{type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Implementation Example</h4>
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{implementation}</code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="strategies" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Handling Strategies</h4>
                    <ul className="space-y-2">
                      {handlingStrategies.map((strategy) => (
                        <li key={strategy} className="flex items-start gap-2">
                          <Shield className="h-3 w-3 text-blue-600 mt-0.5 shrink-0" />
                          <span className="text-sm">{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recovery Options</h4>
                    <ul className="space-y-2">
                      {recoveryOptions.map((option) => (
                        <li key={option} className="flex items-start gap-2">
                          <RefreshCw className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                          <span className="text-sm">{option}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="practices" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Best Practices</h4>
                    <ul className="space-y-2">
                      {bestPractices.map((practice) => (
                        <li key={practice} className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                          <span className="text-sm">{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
 * Custom Error Fallback Components
 */
function CustomErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Card className="border-red-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Component Error
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button onClick={reset} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Component
          </Button>
          <Button onClick={() => window.location.reload()} size="sm" variant="outline">
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main Error Handling Example Page Component
 */
export default function ErrorHandlingExamplePage() {
  // Error handling configurations for documentation
  const errorHandlers: ErrorDocProps[] = [
    {
      id: "error-boundary",
      name: "Error Boundaries",
      description: "React Error Boundaries for catching and handling component errors",
      icon: AlertTriangle,
      color: "text-red-600",
      component: (
        <ErrorBoundary fallback={CustomErrorFallback}>
          <CrashingComponent />
        </ErrorBoundary>
      ),
      errorTypes: [
        "Component render errors",
        "JavaScript runtime errors",
        "Async operation failures in components",
        "Third-party library errors",
      ],
      handlingStrategies: [
        "Graceful error boundaries around critical components",
        "Custom fallback UI with recovery options",
        "Error logging and reporting to monitoring services",
        "User-friendly error messages with actionable steps",
      ],
      recoveryOptions: [
        "Component reset without page reload",
        "Retry failed operations",
        "Navigate to safe fallback page",
        "Contact support with error details",
      ],
      bestPractices: [
        "Place error boundaries at strategic component levels",
        "Provide meaningful error messages to users",
        "Log errors for debugging and monitoring",
        "Always offer a way to recover or get help",
        "Test error scenarios during development",
      ],
      implementation: `import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Log to monitoring service
    // logErrorToService(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={() => this.setState({ hasError: false })}
          />
        );
      }
      
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={CustomErrorFallback}>
  <YourComponent />
</ErrorBoundary>`,
    },
    {
      id: "network-errors",
      name: "Network Error Handling",
      description: "Handling network failures, timeouts, and connectivity issues",
      icon: WifiOff,
      color: "text-orange-600",
      component: <NetworkErrorDemo />,
      errorTypes: [
        "Network connection failures",
        "API server errors (500, 503, etc.)",
        "Request timeouts",
        "Rate limiting errors",
        "CORS issues",
      ],
      handlingStrategies: [
        "Exponential backoff retry logic",
        "Network status monitoring",
        "Offline state detection and handling",
        "Request queuing for retry when back online",
        "Circuit breaker pattern for failing services",
      ],
      recoveryOptions: [
        "Automatic retry with backoff",
        "Manual retry button for users",
        "Offline mode with local caching",
        "Fallback to cached data",
        "Switch to alternative API endpoints",
      ],
      bestPractices: [
        "Implement proper loading states",
        "Show clear error messages with retry options",
        "Use network status APIs to detect connectivity",
        "Cache responses for offline access",
        "Set appropriate timeout values",
        "Monitor network errors for insights",
      ],
      implementation: `import { useState, useEffect } from "react";

function useNetworkError() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const makeRequest = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000) // 10s timeout
      });

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      setError(null);
      setRetryCount(0);
      return response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);

      // Exponential backoff retry
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          makeRequest(url, options);
        }, Math.pow(2, retryCount) * 1000);
      }

      throw err;
    }
  };

  return { makeRequest, isOnline, error, retryCount };
}`,
    },
    {
      id: "auth-errors",
      name: "Authentication Errors",
      description: "Handling authentication failures, session expiry, and permission issues",
      icon: ShieldX,
      color: "text-purple-600",
      component: <AuthErrorDemo />,
      errorTypes: [
        "Session expiration",
        "Invalid credentials",
        "Insufficient permissions",
        "Account locked/suspended",
        "Email not verified",
        "Multi-factor authentication failures",
      ],
      handlingStrategies: [
        "Automatic token refresh logic",
        "Graceful session expiry handling",
        "Permission-based UI rendering",
        "Secure error message display",
        "Automatic logout on critical auth errors",
      ],
      recoveryOptions: [
        "Redirect to login page",
        "Token refresh attempts",
        "Elevate permissions request",
        "Account recovery flows",
        "Contact support options",
      ],
      bestPractices: [
        "Never expose sensitive error details",
        "Implement proper session monitoring",
        "Use secure token storage methods",
        "Provide clear next steps for users",
        "Log security events for monitoring",
        "Implement rate limiting for auth attempts",
      ],
      implementation: `import { useEffect } from "react";
import { useAuth, useRouter } from "@/lib/auth";

function useAuthErrorHandler() {
  const { user, error: authError, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authError) {
      switch (authError.code) {
        case 'SESSION_EXPIRED':
          // Try to refresh token
          refreshToken().catch(() => {
            logout();
            router.push('/login?reason=session_expired');
          });
          break;

        case 'INSUFFICIENT_PERMISSIONS':
          // Show permission denied message
          showError('You do not have permission to access this resource');
          break;

        case 'ACCOUNT_LOCKED':
          // Redirect to account recovery
          router.push('/account-recovery');
          break;

        case 'EMAIL_NOT_VERIFIED':
          // Redirect to email verification
          router.push('/verify-email');
          break;

        default:
          // Generic auth error handling
          console.error('Authentication error:', authError);
          logout();
          router.push('/login');
      }
    }
  }, [authError]);

  const handleAuthError = (error: AuthError) => {
    // Log security event
    logSecurityEvent(error);
    
    // Handle based on error type
    switch (error.type) {
      case 'INVALID_CREDENTIALS':
        return 'Invalid email or password';
      case 'RATE_LIMITED':
        return 'Too many attempts. Please try again later.';
      default:
        return 'Authentication failed. Please try again.';
    }
  };

  return { handleAuthError };
}`,
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Error Handling</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive error handling patterns with recovery strategies and user feedback
        </p>
      </div>

      {/* User Status */}
      <UserStatusPanel />

      {/* Info Card */}
      <Card className="border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Error Handling Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Effective error handling improves user experience by providing clear feedback, recovery options, and
              maintaining application stability. Our approach covers component errors, network failures, authentication
              issues, and user input validation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Error Detection:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Error boundaries</li>
                  <li>• Try-catch blocks</li>
                  <li>• Network monitoring</li>
                  <li>• Status validation</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">User Feedback:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Clear error messages</li>
                  <li>• Visual error states</li>
                  <li>• Progress indicators</li>
                  <li>• Recovery guidance</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Recovery:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Automatic retries</li>
                  <li>• Manual retry options</li>
                  <li>• Fallback content</li>
                  <li>• Support channels</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Handlers Documentation */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Error Handling Patterns</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Click on any error type below to see live demos, implementation examples, and recovery strategies.
          </p>
        </div>

        {errorHandlers.map((handler) => (
          <ErrorDocumentation key={handler.id} {...handler} />
        ))}
      </div>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Implementation Guide
          </CardTitle>
          <CardDescription>How to implement comprehensive error handling in your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">1. Global Error Handling Setup</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// app/layout.tsx - Global error boundary
import { ErrorBoundary } from "@/components/error-boundary";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

// Global error handler for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Log to monitoring service
});`}</code>
              </pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">2. API Error Handling</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// lib/api-client.ts
class ApiClient {
  async request(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NetworkError('Network connection failed');
      }
      throw error;
    }
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}`}</code>
              </pre>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">3. Component Error Recovery</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// components/ErrorRetry.tsx
function ErrorRetry({ 
  onRetry, 
  error, 
  retryCount = 0 
}: {
  onRetry: () => void;
  error: Error;
  retryCount?: number;
}) {
  return (
    <Card className="border-red-500">
      <CardContent className="pt-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        
        <div className="mt-4 flex gap-2">
          <Button onClick={onRetry} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again {retryCount > 0 && \`(\${retryCount + 1})\`}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/support">Get Help</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Error Handling Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">✅ Do</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                  Provide clear, actionable error messages
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                  Implement error boundaries at strategic levels
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                  Log errors for debugging and monitoring
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                  Offer recovery options (retry, reload, contact support)
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                  Test error scenarios during development
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-red-600">❌ Don't</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
                  Show technical error details to end users
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
                  Ignore errors or fail silently
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
                  Use generic "Something went wrong" messages
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
                  Crash the entire app for minor errors
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
                  Forget to handle async/promise rejections
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
                <a href="/examples/forms">Forms</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/examples/guards">Guards</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/examples/hocs">HOCs</a>
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
