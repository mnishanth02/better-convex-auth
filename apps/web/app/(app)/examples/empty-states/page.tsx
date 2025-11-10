/**
 * Empty States Demo Page
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { 
  EmptyDashboard, 
  EmptyProfile, 
  EmptyAdmin,
  EmptySearch,
  EmptyError
} from "@/components/empty-states";

export default function EmptyStatesPage() {
  const [retryLoading, setRetryLoading] = useState(false);

  const handleRetry = () => {
    setRetryLoading(true);
    setTimeout(() => setRetryLoading(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Empty States</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive empty state components for better user experience
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Dashboard Empty State */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Empty Dashboard</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome screen for new users
                </p>
              </div>
              <Badge variant="default">Main</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg bg-muted/20">
              <EmptyDashboard 
                userName="John Doe"
                onGetStarted={() => alert("Get started clicked!")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Empty State */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Empty Profile</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Profile completion tracking
                </p>
              </div>
              <Badge variant="secondary">Profile</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg bg-muted/20">
              <EmptyProfile 
                onEditProfile={() => alert("Edit profile clicked!")}
                onUploadPhoto={() => alert("Upload photo clicked!")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Admin No Access */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Admin - No Access</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Access control state
                </p>
              </div>
              <Badge variant="destructive">Admin</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg bg-muted/20">
              <EmptyAdmin 
                type="no-access"
                userRole="user"
                onRequestAccess={() => alert("Access requested!")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Admin Welcome */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Admin - Welcome</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  New admin welcome screen
                </p>
              </div>
              <Badge variant="destructive">Admin</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg bg-muted/20">
              <EmptyAdmin type="no-data" />
            </div>
          </CardContent>
        </Card>

        {/* Empty Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Empty Search</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  No search results found
                </p>
              </div>
              <Badge variant="outline">Utility</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg bg-muted/20">
              <EmptySearch onClearFilters={() => alert("Filters cleared!")} />
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Error State</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Something went wrong
                </p>
              </div>
              <Badge variant="outline">Utility</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg bg-muted/20">
              <EmptyError onRetry={handleRetry} retryLoading={retryLoading} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Available Components</h4>
            <ul className="text-sm space-y-1 text-muted-foreground ml-4">
              <li>• <code>EmptyDashboard</code> - Welcome new users with guided actions</li>
              <li>• <code>EmptyProfile</code> - Encourage profile completion</li>
              <li>• <code>EmptyAdmin</code> - Handle admin access states</li>
              <li>• <code>EmptyGeneric</code> - Flexible empty state component</li>
              <li>• <code>EmptySearch</code> - No search results found</li>
              <li>• <code>EmptyError</code> - Error recovery actions</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Best Practices</h4>
            <ul className="text-sm space-y-1 text-muted-foreground ml-4">
              <li>• Keep messaging positive and helpful</li>
              <li>• Provide clear next steps</li>
              <li>• Use appropriate icons and imagery</li>
              <li>• Test with real users for clarity</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}