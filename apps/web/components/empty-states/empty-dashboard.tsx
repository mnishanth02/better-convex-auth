/**
 * Empty Dashboard Component
 *
 * Displays when user dashboard has no data or activity to show.
 * Provides clear guidance and call-to-action buttons.
 */

"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { BarChart3, Plus, BookOpen, ArrowRight, Sparkles, Target } from "lucide-react";
import Link from "next/link";

interface EmptyDashboardProps {
  userName?: string;
  onGetStarted?: () => void;
  showQuickActions?: boolean;
}

export function EmptyDashboard({ userName, onGetStarted, showQuickActions = true }: EmptyDashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="h-12 w-12 text-blue-600" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-yellow-600" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Welcome{userName && `, ${userName}`}!</h2>
        <p className="text-muted-foreground">
          Your dashboard is ready to go. Start exploring the authentication features and build something amazing with
          Better Auth.
        </p>
      </div>

      {/* Actions */}
      {showQuickActions && (
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button onClick={onGetStarted} size="lg" className="group">
            <Target className="mr-2 h-4 w-4" />
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="/examples">
              <BookOpen className="mr-2 h-4 w-4" />
              View Examples
            </Link>
          </Button>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-2xl">
        <Link href="/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium">Update Profile</h3>
              <p className="text-xs text-muted-foreground mt-1">Customize your account</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/security">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium">Security Settings</h3>
              <p className="text-xs text-muted-foreground mt-1">Manage your security</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/examples">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium">Explore Features</h3>
              <p className="text-xs text-muted-foreground mt-1">See what's possible</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
