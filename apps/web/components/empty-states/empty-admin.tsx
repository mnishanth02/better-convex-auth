/**
 * Empty Admin Component
 *
 * Displays when admin dashboard has no data or when user lacks admin permissions.
 * Provides guidance for admin setup and management.
 */

"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Shield, Users, Settings, AlertTriangle, Crown, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { generateUniqueId } from "@/lib/utils";

type EmptyAdminType = "no-access" | "no-data" | "setup-required";

interface EmptyAdminProps {
  type: EmptyAdminType;
  userRole?: string;
  onRequestAccess?: () => void;
  onSetupAdmin?: () => void;
}

export function EmptyAdmin({ type, userRole, onRequestAccess, onSetupAdmin }: EmptyAdminProps) {
  const getContent = () => {
    switch (type) {
      case "no-access":
        return {
          icon: Lock,
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          color: "text-red-600",
          bgColor: "bg-red-100",
          actions: [
            {
              label: "Request Access",
              onClick: onRequestAccess,
              variant: "default" as const,
            },
            {
              label: "Contact Admin",
              href: "/support",
              variant: "outline" as const,
            },
          ],
        };

      case "setup-required":
        return {
          icon: Settings,
          title: "Admin Setup Required",
          description: "The admin panel needs to be configured before you can manage users and settings.",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          actions: [
            {
              label: "Setup Admin Panel",
              onClick: onSetupAdmin,
              variant: "default" as const,
            },
          ],
        };

      case "no-data":
      default:
        return {
          icon: Crown,
          title: "Welcome to Admin Panel",
          description: "You have admin access! Start by managing users, configuring settings, or monitoring activity.",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          actions: [
            {
              label: "Manage Users",
              href: "/admin/users",
              variant: "default" as const,
            },
            {
              label: "Configure Settings",
              href: "/admin/settings",
              variant: "outline" as const,
            },
          ],
        };
    }
  };

  const content = getContent();
  const IconComponent = content.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      {/* Icon */}
      <div className="relative mb-6">
        <div className={`w-24 h-24 ${content.bgColor} rounded-full flex items-center justify-center mb-4 shadow-sm`}>
          <IconComponent className={`h-12 w-12 ${content.color}`} />
        </div>
        {type === "no-access" && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-foreground">{content.title}</h2>
        <p className="text-muted-foreground">{content.description}</p>
      </div>

      {/* User Role Alert */}
      {userRole && type === "no-access" && (
        <Alert className="max-w-md mt-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your current role: <strong>{userRole}</strong>. Admin access required.
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        {content.actions.map((action, index) => {
          if ("href" in action) {
            return (
              <Button key={generateUniqueId()} variant={action.variant} size="lg" asChild>
                <Link href={action.href}>
                  {action.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            );
          } else {
            return (
              <Button
                key={generateUniqueId()}
                variant={action.variant}
                size="lg"
                onClick={action.onClick}
                className="group"
              >
                {action.label}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            );
          }
        })}
      </div>

      {/* Admin Features Overview */}
      {type === "no-data" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-md">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">View, edit, and manage user accounts</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-600" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">Configure app settings and preferences</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
