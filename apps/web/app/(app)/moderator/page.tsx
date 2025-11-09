"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Textarea } from "@workspace/ui/components/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
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
  Flag,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Image,
  FileText,
  AlertTriangle,
  Eye,
  TrendingUp,
  Users,
} from "lucide-react";

interface ContentItem {
  id: string;
  type: "comment" | "post" | "image" | "report";
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  reportedBy: {
    name: string;
    reason: string;
  };
  status: "pending" | "approved" | "rejected";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
}

const mockContent: ContentItem[] = [
  {
    id: "1",
    type: "comment",
    content: "This is an inappropriate comment that violates our community guidelines.",
    author: {
      name: "John Doe",
      email: "john@example.com",
    },
    reportedBy: {
      name: "Jane Smith",
      reason: "Inappropriate language",
    },
    status: "pending",
    priority: "high",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    reviewedAt: null,
    reviewedBy: null,
  },
  {
    id: "2",
    type: "post",
    content: "Check out this amazing product! [spam link removed]",
    author: {
      name: "Bob Wilson",
      email: "bob@example.com",
    },
    reportedBy: {
      name: "Alice Johnson",
      reason: "Spam content",
    },
    status: "pending",
    priority: "medium",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    reviewedAt: null,
    reviewedBy: null,
  },
  {
    id: "3",
    type: "image",
    content: "Image contains potentially offensive material",
    author: {
      name: "Charlie Brown",
      email: "charlie@example.com",
    },
    reportedBy: {
      name: "Diana Prince",
      reason: "Offensive content",
    },
    status: "pending",
    priority: "high",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    reviewedAt: null,
    reviewedBy: null,
  },
  {
    id: "4",
    type: "comment",
    content: "Great article! Thanks for sharing.",
    author: {
      name: "Ethan Hunt",
      email: "ethan@example.com",
    },
    reportedBy: {
      name: "Fiona Green",
      reason: "Mistakenly reported",
    },
    status: "approved",
    priority: "low",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    reviewedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    reviewedBy: "Admin",
  },
  {
    id: "5",
    type: "post",
    content: "Hate speech and harassment targeting other users.",
    author: {
      name: "Gary Moore",
      email: "gary@example.com",
    },
    reportedBy: {
      name: "Hannah Lee",
      reason: "Harassment",
    },
    status: "rejected",
    priority: "high",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    reviewedAt: new Date(Date.now() - 47 * 60 * 60 * 1000),
    reviewedBy: "Moderator",
  },
];

export default function ModeratorPanelPage() {
  const [items, setItems] = useState<ContentItem[]>(mockContent);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const stats = {
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
    highPriority: items.filter((i) => i.priority === "high" && i.status === "pending").length,
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "comment":
        return (
          <Badge variant="secondary">
            <MessageSquare className="mr-1 h-3 w-3" />
            Comment
          </Badge>
        );
      case "post":
        return (
          <Badge variant="secondary">
            <FileText className="mr-1 h-3 w-3" />
            Post
          </Badge>
        );
      case "image":
        return (
          <Badge variant="secondary">
            <Image className="mr-1 h-3 w-3" />
            Image
          </Badge>
        );
      case "report":
        return (
          <Badge variant="secondary">
            <Flag className="mr-1 h-3 w-3" />
            Report
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleReview = (item: ContentItem, action: "approve" | "reject") => {
    setSelectedItem(item);
    setReviewAction(action);
    setReviewNotes("");
    setShowReviewDialog(true);
  };

  const confirmReview = () => {
    if (!selectedItem || !reviewAction) return;

    setItems(
      items.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              status: reviewAction === "approve" ? "approved" : "rejected",
              reviewedAt: new Date(),
              reviewedBy: "Current Moderator",
            }
          : item,
      ),
    );

    setShowReviewDialog(false);
    setSelectedItem(null);
    setReviewAction(null);
    setReviewNotes("");
  };

  return (
    <RoleGuard roles={["moderator"]} redirectTo="/app/dashboard">
      <div className="container mx-auto max-w-7xl p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Moderator Panel</h1>
          <p className="text-muted-foreground mt-1">Review and moderate flagged content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Review</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Awaiting action
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                No violations
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Rejected</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <XCircle className="h-4 w-4" />
                Removed content
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>High Priority</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.highPriority}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                Urgent review needed
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Moderation Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <CardTitle>Your Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Reviews Today</span>
                  <span className="text-2xl font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Response Time</span>
                  <span className="text-2xl font-bold">2.5h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy Rate</span>
                  <span className="text-2xl font-bold">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>Team Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Jane Doe reviewed 3 items</p>
                    <p className="text-muted-foreground text-xs">10 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>BS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Bob Smith approved 5 posts</p>
                    <p className="text-muted-foreground text-xs">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AP</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Alice Park rejected 2 comments</p>
                    <p className="text-muted-foreground text-xs">2 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Moderation Queue */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Moderation Queue</CardTitle>
                <CardDescription>Review flagged content and take action</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No items found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="max-w-md">
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={item.author.avatar} />
                                <AvatarFallback>
                                  {item.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.author.name}</p>
                                <p className="text-xs text-muted-foreground">{item.author.email}</p>
                              </div>
                            </div>
                            <p className="text-sm line-clamp-2">{item.content}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Flag className="h-3 w-3 text-red-600" />
                              <span>
                                Reported by {item.reportedBy.name}: {item.reportedBy.reason}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(item.type)}</TableCell>
                        <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm">{formatTime(item.createdAt)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.status === "pending" ? (
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReview(item, "approve")}
                                className="text-green-600"
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReview(item, "reject")}
                                className="text-red-600"
                              >
                                <XCircle className="mr-1 h-3 w-3" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{reviewAction === "approve" ? "Approve Content" : "Reject Content"}</DialogTitle>
              <DialogDescription>
                Review this {selectedItem?.type} and provide notes for your decision
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Content Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <div className="rounded-lg border p-4 bg-muted">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={selectedItem?.author.avatar} />
                      <AvatarFallback>
                        {selectedItem?.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{selectedItem?.author.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedItem?.author.email}</p>
                    </div>
                  </div>
                  <p className="text-sm">{selectedItem?.content}</p>
                </div>
              </div>

              {/* Report Info */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Details</label>
                <div className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Reported by {selectedItem?.reportedBy.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Reason: {selectedItem?.reportedBy.reason}</p>
                  <div className="flex gap-2 mt-2">
                    {getTypeBadge(selectedItem?.type || "")}
                    {getPriorityBadge(selectedItem?.priority || "")}
                  </div>
                </div>
              </div>

              {/* Review Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Moderation Notes</label>
                <Textarea
                  placeholder={
                    reviewAction === "approve"
                      ? "Explain why this content is acceptable..."
                      : "Explain why this content violates guidelines..."
                  }
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmReview}
                className={
                  reviewAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }
              >
                {reviewAction === "approve" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve Content
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Content
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
