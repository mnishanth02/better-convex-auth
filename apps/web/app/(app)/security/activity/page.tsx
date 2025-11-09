"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Download,
  Filter,
  Shield,
} from "lucide-react";
import Link from "next/link";

interface LoginActivity {
  id: string;
  timestamp: Date;
  type: "success" | "failed" | "suspicious";
  device: {
    type: "desktop" | "mobile" | "tablet";
    name: string;
    browser: string;
    os: string;
  };
  location: {
    city: string;
    country: string;
    ip: string;
  };
}

const mockActivities: LoginActivity[] = [
  {
    id: "1",
    timestamp: new Date(),
    type: "success",
    device: {
      type: "desktop",
      name: "MacBook Pro",
      browser: "Chrome 120",
      os: "macOS 14.2",
    },
    location: {
      city: "San Francisco",
      country: "United States",
      ip: "192.168.1.1",
    },
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: "success",
    device: {
      type: "mobile",
      name: "iPhone 15 Pro",
      browser: "Safari 17",
      os: "iOS 17.2",
    },
    location: {
      city: "San Francisco",
      country: "United States",
      ip: "192.168.1.1",
    },
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    type: "failed",
    device: {
      type: "desktop",
      name: "Unknown Device",
      browser: "Chrome 119",
      os: "Windows 11",
    },
    location: {
      city: "London",
      country: "United Kingdom",
      ip: "81.2.69.142",
    },
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: "success",
    device: {
      type: "tablet",
      name: "iPad Air",
      browser: "Safari 17",
      os: "iPadOS 17.2",
    },
    location: {
      city: "San Francisco",
      country: "United States",
      ip: "192.168.1.1",
    },
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: "suspicious",
    device: {
      type: "desktop",
      name: "Unknown Device",
      browser: "Firefox 121",
      os: "Linux",
    },
    location: {
      city: "Moscow",
      country: "Russia",
      ip: "185.220.101.1",
    },
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    type: "success",
    device: {
      type: "desktop",
      name: "MacBook Pro",
      browser: "Chrome 120",
      os: "macOS 14.2",
    },
    location: {
      city: "San Francisco",
      country: "United States",
      ip: "192.168.1.1",
    },
  },
  {
    id: "7",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    type: "success",
    device: {
      type: "mobile",
      name: "iPhone 15 Pro",
      browser: "Safari 17",
      os: "iOS 17.2",
    },
    location: {
      city: "Los Angeles",
      country: "United States",
      ip: "192.168.2.1",
    },
  },
  {
    id: "8",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    type: "failed",
    device: {
      type: "desktop",
      name: "Unknown Device",
      browser: "Edge 120",
      os: "Windows 11",
    },
    location: {
      city: "Berlin",
      country: "Germany",
      ip: "46.114.0.1",
    },
  },
];

export default function ActivityPage() {
  const [activities] = useState<LoginActivity[]>(mockActivities);
  const [filter, setFilter] = useState<"all" | "success" | "failed" | "suspicious">("all");
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("30days");

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true;
    return activity.type === filter;
  });

  const getDeviceIcon = (type: "desktop" | "mobile" | "tablet") => {
    switch (type) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      default:
        return Monitor;
    }
  };

  const getStatusBadge = (type: "success" | "failed" | "suspicious") => {
    switch (type) {
      case "success":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Success
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      case "suspicious":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Shield className="mr-1 h-3 w-3" />
            Suspicious
          </Badge>
        );
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const handleExport = () => {
    const csv = [
      ["Timestamp", "Type", "Device", "Browser", "OS", "Location", "IP"].join(","),
      ...filteredActivities.map((a) =>
        [
          a.timestamp.toISOString(),
          a.type,
          a.device.name,
          a.device.browser,
          a.device.os,
          `${a.location.city}, ${a.location.country}`,
          a.location.ip,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `login-activity-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const suspiciousCount = activities.filter((a) => a.type === "suspicious").length;
  const failedCount = activities.filter((a) => a.type === "failed").length;

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/app/security">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Security
        </Link>
      </Button>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Login Activity</h1>
        <p className="text-muted-foreground mt-1">Review your account's sign-in history and security events</p>
      </div>

      {/* Security Alerts */}
      {(suspiciousCount > 0 || failedCount > 0) && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>Security Alert:</strong> We detected {suspiciousCount} suspicious and {failedCount} failed login
            attempts. Review your activity and secure your account if needed.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Logins</CardDescription>
            <CardTitle className="text-3xl">{activities.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Successful</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {activities.filter((a) => a.type === "success").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Authorized access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Failed Attempts</CardDescription>
            <CardTitle className="text-3xl text-red-600">{failedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Incorrect credentials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Suspicious</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{suspiciousCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Unusual locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Detailed history of all login attempts</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
                <SelectTrigger className="w-[140px]">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activity</SelectItem>
                  <SelectItem value="success">Success Only</SelectItem>
                  <SelectItem value="failed">Failed Only</SelectItem>
                  <SelectItem value="suspicious">Suspicious Only</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No activity found for the selected filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActivities.map((activity) => {
                    const DeviceIcon = getDeviceIcon(activity.device.type);
                    return (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatTimestamp(activity.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(activity.type)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{activity.device.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.device.browser} • {activity.device.os}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm">{activity.location.city}</p>
                              <p className="text-xs text-muted-foreground">{activity.location.country}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs font-mono">{activity.location.ip}</code>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Protect Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Review regularly:</strong> Check your activity log weekly for any unauthorized access attempts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Enable 2FA:</strong> Add two-factor authentication for an extra layer of security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Use passkeys:</strong> Passkeys provide the most secure and convenient sign-in method.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Suspicious activity?</strong> If you see an entry you don't recognize, change your password
                immediately and revoke unknown sessions.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
