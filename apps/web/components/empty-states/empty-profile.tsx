/**
 * Empty Profile Component
 *
 * Displays when user profile is incomplete or has no data.
 * Encourages profile completion with helpful guidance.
 */

"use client";

import { generateUniqueId } from "@/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { User, Edit3, Camera, ArrowRight, CheckCircle2, Circle } from "lucide-react";

interface EmptyProfileProps {
  onEditProfile?: () => void;
  onUploadPhoto?: () => void;
  completionItems?: {
    label: string;
    completed: boolean;
    action?: () => void;
  }[];
}

export function EmptyProfile({
  onEditProfile,
  onUploadPhoto,
  completionItems = [
    { label: "Add profile photo", completed: false },
    { label: "Update display name", completed: false },
    { label: "Verify email address", completed: true },
    { label: "Set up security settings", completed: false },
  ],
}: EmptyProfileProps) {
  const completedCount = completionItems.filter((item) => item.completed).length;
  const completionPercentage = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      {/* Profile Avatar Placeholder */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
          <User className="h-12 w-12 text-gray-400" />
        </div>
        <button
          onClick={onUploadPhoto}
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label="Upload profile photo"
          type="button"
        >
          <Camera className="h-4 w-4 text-primary-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Complete Your Profile</h2>
        <p className="text-muted-foreground">
          Add some personal details to make your account more personalized and secure.
        </p>
      </div>

      {/* Progress */}
      <Card className="w-full max-w-md mt-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="space-y-3">
            {completionItems.map((item) => (
              <div key={generateUniqueId()} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={item.completed ? "text-green-600" : "text-foreground"}>{item.label}</span>
                </div>
                {!item.completed && item.action && (
                  <Button size="sm" variant="ghost" onClick={item.action} className="h-6 px-2">
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Button onClick={onEditProfile} size="lg" className="mt-6 group">
        <Edit3 className="mr-2 h-4 w-4" />
        Edit Profile
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
