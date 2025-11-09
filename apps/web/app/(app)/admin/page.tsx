"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { RoleGuard } from "@auth/ui";
import {
  Users,
  UserCog,
  Shield,
  Activity,
  MoreVertical,
  Search,
  Filter,
  Download,
  UserPlus,
  Ban,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Calendar,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "moderator" | "admin";
  status: "active" | "suspended" | "pending";
  emailVerified: boolean;
  createdAt: Date;
  lastLogin: Date | null;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    emailVerified: true,
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "moderator",
    status: "active",
    emailVerified: true,
    createdAt: new Date("2024-02-20"),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "user",
    status: "active",
    emailVerified: true,
    createdAt: new Date("2024-03-10"),
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "user",
    status: "suspended",
    emailVerified: true,
    createdAt: new Date("2024-03-25"),
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "user",
    status: "pending",
    emailVerified: false,
    createdAt: new Date("2024-04-01"),
    lastLogin: null,
  },
  {
    id: "6",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "moderator",
    status: "active",
    emailVerified: true,
    createdAt: new Date("2024-02-15"),
    lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "7",
    name: "Ethan Hunt",
    email: "ethan@example.com",
    role: "user",
    status: "active",
    emailVerified: true,
    createdAt: new Date("2024-03-20"),
    lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "8",
    name: "Fiona Green",
    email: "fiona@example.com",
    role: "user",
    status: "active",
    emailVerified: false,
    createdAt: new Date("2024-04-05"),
    lastLogin: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<"suspend" | "delete" | "role" | null>(null);
  const [newRole, setNewRole] = useState<"user" | "moderator" | "admin">("user");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    pending: users.filter((u) => u.status === "pending").length,
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <Shield className="mr-1 h-3 w-3" />
            Admin
          </Badge>
        );
      case "moderator":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <UserCog className="mr-1 h-3 w-3" />
            Moderator
          </Badge>
        );
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-800">
            <Ban className="mr-1 h-3 w-3" />
            Suspended
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatLastLogin = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  const handleSuspendUser = () => {
    if (!selectedUser) return;
    setUsers(
      users.map((u) =>
        u.id === selectedUser.id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u,
      ),
    );
    setActionDialog(null);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setActionDialog(null);
    setSelectedUser(null);
  };

  const handleChangeRole = () => {
    if (!selectedUser) return;
    setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u)));
    setActionDialog(null);
    setSelectedUser(null);
  };

  const handleBulkAction = (action: "suspend" | "delete") => {
    if (action === "suspend") {
      setUsers(users.map((u) => (selectedUsers.includes(u.id) ? { ...u, status: "suspended" } : u)));
    } else if (action === "delete") {
      setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
    }
    setSelectedUsers([]);
  };

  const handleExportUsers = () => {
    const csv = [
      ["Name", "Email", "Role", "Status", "Email Verified", "Created", "Last Login"].join(","),
      ...filteredUsers.map((u) =>
        [
          u.name,
          u.email,
          u.role,
          u.status,
          u.emailVerified ? "Yes" : "No",
          formatDate(u.createdAt),
          formatLastLogin(u.lastLogin),
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <RoleGuard roles={["admin"]} redirectTo="/dashboard">
      <div className="container mx-auto max-w-7xl p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage users, roles, and system settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                All registered users
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Users</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.active}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                Verified & active
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Suspended</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.suspended}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Ban className="h-4 w-4" />
                Temporarily blocked
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Awaiting verification
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <div className="p-2 rounded-lg bg-green-100">
                  <UserPlus className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New user registered</p>
                  <p className="text-muted-foreground">Charlie Brown joined • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="p-2 rounded-lg bg-red-100">
                  <Ban className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">User suspended</p>
                  <p className="text-muted-foreground">Alice Johnson was suspended • 1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="p-2 rounded-lg bg-blue-100">
                  <UserCog className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Role changed</p>
                  <p className="text-muted-foreground">Jane Smith promoted to moderator • 3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Search, filter, and manage user accounts</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportUsers}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                {selectedUsers.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("suspend")}
                      className="text-orange-600"
                    >
                      Suspend ({selectedUsers.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("delete")}
                      className="text-destructive"
                    >
                      Delete ({selectedUsers.length})
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length}
                        onChange={(e) => setSelectedUsers(e.target.checked ? filteredUsers.map((u) => u.id) : [])}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No users found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) =>
                              setSelectedUsers(
                                e.target.checked
                                  ? [...selectedUsers, user.id]
                                  : selectedUsers.filter((id) => id !== user.id),
                              )
                            }
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {user.email}
                                {user.emailVerified && <CheckCircle2 className="h-3 w-3 text-green-600 ml-1" />}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{formatLastLogin(user.lastLogin)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setNewRole(user.role);
                                  setActionDialog("role");
                                }}
                              >
                                <UserCog className="mr-2 h-4 w-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionDialog("suspend");
                                }}
                                className="text-orange-600"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                {user.status === "suspended" ? "Unsuspend" : "Suspend"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionDialog("delete");
                                }}
                                className="text-destructive"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Suspend/Unsuspend Dialog */}
        <AlertDialog open={actionDialog === "suspend"} onOpenChange={() => setActionDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedUser?.status === "suspended" ? "Unsuspend User?" : "Suspend User?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedUser?.status === "suspended"
                  ? `Restore access for ${selectedUser?.name}? They will be able to sign in and use the platform again.`
                  : `Temporarily block ${selectedUser?.name}? They won't be able to sign in until unsuspended.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSuspendUser} className="bg-orange-600 hover:bg-orange-700">
                {selectedUser?.status === "suspended" ? "Unsuspend" : "Suspend"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Dialog */}
        <AlertDialog open={actionDialog === "delete"} onOpenChange={() => setActionDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User?</AlertDialogTitle>
              <AlertDialogDescription>
                Permanently delete {selectedUser?.name}'s account? This action cannot be undone. All their data will be
                removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Change Role Dialog */}
        <Dialog open={actionDialog === "role"} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>Update the role for {selectedUser?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select New Role</label>
                <Select value={newRole} onValueChange={(v: any) => setNewRole(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User - Standard access</SelectItem>
                    <SelectItem value="moderator">Moderator - Content management</SelectItem>
                    <SelectItem value="admin">Admin - Full system access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-medium mb-1">Current role: {selectedUser?.role}</p>
                <p className="text-muted-foreground text-xs">Changing roles affects user permissions immediately</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Cancel
              </Button>
              <Button onClick={handleChangeRole}>Update Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
