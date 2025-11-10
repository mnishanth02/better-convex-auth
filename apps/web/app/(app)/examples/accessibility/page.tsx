/**
 * Accessibility Demo Page
 *
 * Comprehensive showcase of accessibility features and components.
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { AccessibleButton } from "@/components/ui/accessible-button";
import {
  AccessibleInput,
  AccessibleTextarea,
  FormProvider,
  FieldGroup,
  AccessibleLabel,
} from "@/components/ui/accessible-form";
import { SkipLinks, useSkipTarget } from "@/components/ui/skip-links";
import { AccessibleNavigation, AccessibleBreadcrumb, type NavigationItem } from "@/components/ui/accessible-navigation";
import { useFocusManagement, useAriaLive, useKeyboardNavigation, useScreenReader } from "@/hooks/use-accessibility";
import {
  Globe,
  Home,
  Settings,
  User,
  FileText,
  Shield,
  Accessibility,
  Keyboard,
  Volume2,
  Eye,
  CheckCircle,
} from "lucide-react";
import { generateUniqueId } from "@/lib/utils";

const navigationItems: NavigationItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "profile", label: "Profile", href: "/profile", icon: User },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
  { id: "docs", label: "Documentation", href: "/docs", icon: FileText, external: true },
];

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Examples", href: "/examples" },
  { label: "Accessibility" },
];

export default function AccessibilityPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { announce } = useAriaLive();
  const { setFocus } = useFocusManagement();
  const isScreenReader = useScreenReader();

  // Skip link targets
  const mainRef = useSkipTarget("main");
  const navigationRef = useSkipTarget("navigation");
  const formRef = useSkipTarget("demo-form");
  const featuresRef = useSkipTarget("features");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setTouched(allTouched);

    if (Object.keys(newErrors).length > 0) {
      announce(`Form has ${Object.keys(newErrors).length} errors. Please correct them and try again.`, {
        politeness: "assertive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTouched({});
      announce("Form submitted successfully!", { politeness: "polite" });
    } catch (error) {
      announce("Failed to submit form. Please try again.", { politeness: "assertive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Full keyboard support with logical tab order, arrow key navigation, and keyboard shortcuts.",
    },
    {
      icon: Volume2,
      title: "Screen Reader Support",
      description: "Comprehensive ARIA labels, live regions, and semantic HTML for screen reader accessibility.",
    },
    {
      icon: Eye,
      title: "Visual Accessibility",
      description: "High contrast support, focus indicators, and color-blind friendly design patterns.",
    },
    {
      icon: Shield,
      title: "Focus Management",
      description: "Proper focus trapping, restoration, and visual indicators for interactive elements.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Links */}
      <SkipLinks
        links={[
          { id: "skip-main", label: "Skip to main content", href: "#main" },
          { id: "skip-nav", label: "Skip to navigation", href: "#navigation" },
          { id: "skip-form", label: "Skip to demo form", href: "#demo-form" },
          { id: "skip-features", label: "Skip to features", href: "#features" },
        ]}
      />

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Accessibility Demo</h1>
            {isScreenReader && (
              <Badge variant="outline" className="text-xs">
                Screen reader detected
              </Badge>
            )}
          </div>

          <div ref={navigationRef as React.RefObject<HTMLDivElement>} className="flex items-center gap-4">
            <AccessibleNavigation items={navigationItems} label="Main navigation" />
          </div>
        </div>
      </header>

      <main ref={mainRef} className="container mx-auto max-w-6xl p-6 space-y-8">
        {/* Breadcrumb */}
        <AccessibleBreadcrumb items={breadcrumbItems} />

        {/* Introduction */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Accessibility className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">Accessibility Features</h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive accessibility implementation for inclusive user experiences
              </p>
            </div>
          </div>

          <Card className="border-blue-500">
            <CardHeader>
              <CardTitle>About This Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This page demonstrates comprehensive accessibility features including keyboard navigation, screen reader
                support, focus management, and ARIA attributes. All components are designed to meet WCAG 2.1 AA
                standards.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section ref={featuresRef} className="space-y-6">
          <h2 className="text-3xl font-bold">Accessibility Features</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={generateUniqueId()}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <Separator />

        {/* Interactive Demo Form */}
        <section ref={formRef} className="space-y-6">
          <h2 className="text-3xl font-bold">Interactive Form Demo</h2>
          <p className="text-muted-foreground">
            Try this form with keyboard navigation, screen readers, and assistive technologies.
          </p>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Accessible Contact Form</CardTitle>
              </CardHeader>
              <CardContent>
                <FormProvider errors={errors} touched={touched} isSubmitting={isSubmitting}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <fieldset disabled={isSubmitting} className="space-y-4">
                      <legend className="text-lg font-medium mb-4">Contact Information</legend>

                      <AccessibleInput
                        name="name"
                        label="Full Name"
                        description="Enter your first and last name"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="John Doe"
                      />

                      <AccessibleInput
                        name="email"
                        type="email"
                        label="Email Address"
                        description="We'll never share your email with anyone"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john@example.com"
                      />

                      <AccessibleTextarea
                        name="message"
                        label="Message"
                        description="Tell us how we can help you"
                        required
                        maxLength={500}
                        showCharacterCount
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Your message here..."
                        rows={4}
                      />
                    </fieldset>

                    <div className="flex gap-4">
                      <AccessibleButton
                        type="submit"
                        loading={isSubmitting}
                        loadingText="Submitting your message"
                        announceOnClick="Submitting contact form"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </AccessibleButton>

                      <AccessibleButton
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData({ name: "", email: "", message: "" });
                          setErrors({});
                          setTouched({});
                          announce("Form cleared", { politeness: "polite" });
                        }}
                        disabled={isSubmitting}
                      >
                        Clear Form
                      </AccessibleButton>
                    </div>

                    {showSuccess && (
                      <div
                        role="alert"
                        className="flex items-center gap-2 p-4 border border-green-500 bg-green-50 rounded-md text-green-800"
                      >
                        <CheckCircle className="h-5 w-5" aria-hidden="true" />
                        <span>Message sent successfully! We'll get back to you soon.</span>
                      </div>
                    )}
                  </form>
                </FormProvider>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Testing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Keyboard Navigation</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                    <li>• Use Tab to navigate between form fields</li>
                    <li>• Use Shift+Tab to navigate backwards</li>
                    <li>• Use Enter to submit the form</li>
                    <li>• Use Escape to clear focus</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Screen Reader Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                    <li>• Form labels and descriptions are announced</li>
                    <li>• Error messages use aria-live regions</li>
                    <li>• Character count is announced for textarea</li>
                    <li>• Loading states are communicated</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Visual Accessibility</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                    <li>• High contrast focus indicators</li>
                    <li>• Color-blind friendly error states</li>
                    <li>• Clear visual hierarchy</li>
                    <li>• Sufficient color contrast ratios</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Try These Actions</h4>
                  <div className="space-y-2">
                    <AccessibleButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
                        setFocus(nameInput);
                      }}
                    >
                      Focus Name Field
                    </AccessibleButton>

                    <AccessibleButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        announce("This is a test announcement for screen readers", {
                          politeness: "polite",
                        });
                      }}
                    >
                      Test Announcement
                    </AccessibleButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Implementation Guide */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Implementation Guide</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Key Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">AccessibleButton</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enhanced button with loading states and ARIA attributes
                  </p>
                </div>

                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">AccessibleInput</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Form input with validation and screen reader support
                  </p>
                </div>

                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">AccessibleNavigation</code>
                  <p className="text-sm text-muted-foreground mt-1">Keyboard navigable menu with focus management</p>
                </div>

                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">SkipLinks</code>
                  <p className="text-sm text-muted-foreground mt-1">Quick navigation shortcuts for keyboard users</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accessibility Hooks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">useFocusManagement</code>
                  <p className="text-sm text-muted-foreground mt-1">Focus trapping and restoration utilities</p>
                </div>

                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">useAriaLive</code>
                  <p className="text-sm text-muted-foreground mt-1">Screen reader announcements and live regions</p>
                </div>

                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">useKeyboardNavigation</code>
                  <p className="text-sm text-muted-foreground mt-1">Keyboard event handling and shortcuts</p>
                </div>

                <div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">useRovingTabindex</code>
                  <p className="text-sm text-muted-foreground mt-1">Arrow key navigation for grouped elements</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
