/**
 * Design Tokens & Visual Hierarchy
 * 
 * Consistent design tokens and utility components for a cohesive design system.
 */

import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

// Typography components with consistent hierarchy
export function H1({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )} 
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )} 
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )} 
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4 
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )} 
      {...props}
    >
      {children}
    </h4>
  );
}

export function P({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6",
        className
      )} 
      {...props}
    >
      {children}
    </p>
  );
}

export function Lead({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        "text-xl text-muted-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </p>
  );
}

export function Muted({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        "text-sm text-muted-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </p>
  );
}

export function Small({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <small 
      className={cn(
        "text-sm font-medium leading-none",
        className
      )} 
      {...props}
    >
      {children}
    </small>
  );
}

// Spacing utilities
export function Space({ size = "md" }: { size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" }) {
  const sizeMap = {
    xs: "h-2",
    sm: "h-4", 
    md: "h-6",
    lg: "h-8",
    xl: "h-12",
    "2xl": "h-16"
  };

  return <div className={sizeMap[size]} />;
}

// Container with consistent padding
export function Container({ 
  children, 
  size = "default",
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { 
  size?: "sm" | "default" | "lg" | "xl" | "full" 
}) {
  const sizeClasses = {
    sm: "max-w-2xl",
    default: "max-w-4xl",
    lg: "max-w-6xl", 
    xl: "max-w-7xl",
    full: "max-w-full"
  };

  return (
    <div 
      className={cn(
        "container mx-auto px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Section wrapper
export function Section({ 
  children, 
  className,
  spacing = "default",
  ...props 
}: React.HTMLAttributes<HTMLElement> & {
  spacing?: "sm" | "default" | "lg"
}) {
  const spacingClasses = {
    sm: "py-8",
    default: "py-12",
    lg: "py-16"
  };

  return (
    <section 
      className={cn(spacingClasses[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
}

// Grid system
export function Grid({ 
  children, 
  cols = "auto",
  gap = "md",
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  cols?: "auto" | 1 | 2 | 3 | 4 | 5 | 6 | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const gapClasses = {
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8", 
    xl: "gap-12"
  };

  let colsClass = "";
  if (cols === "auto") {
    colsClass = "grid-cols-auto-fit";
  } else if (typeof cols === "number") {
    colsClass = `grid-cols-${cols}`;
  } else if (typeof cols === "object") {
    const responsive: string[] = [];
    if (cols.sm) responsive.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) responsive.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) responsive.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) responsive.push(`xl:grid-cols-${cols.xl}`);
    colsClass = responsive.join(" ");
  }

  return (
    <div 
      className={cn(
        "grid",
        colsClass,
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Flex utilities
export function Flex({ 
  children,
  direction = "row",
  align = "start",
  justify = "start", 
  wrap = false,
  gap = "md",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const directionClasses = {
    row: "flex-row",
    col: "flex-col",
    "row-reverse": "flex-row-reverse",
    "col-reverse": "flex-col-reverse"
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center", 
    end: "items-end",
    stretch: "items-stretch"
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly"
  };

  const gapClasses = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8"
  };

  return (
    <div 
      className={cn(
        "flex",
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        wrap && "flex-wrap",
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Status indicators
export function StatusBadge({ 
  status,
  className 
}: { 
  status: "active" | "inactive" | "pending" | "error" | "success" | "warning";
  className?: string;
}) {
  const statusConfig = {
    active: { label: "Active", variant: "default" as const, color: "bg-green-500" },
    inactive: { label: "Inactive", variant: "secondary" as const, color: "bg-gray-500" },
    pending: { label: "Pending", variant: "outline" as const, color: "bg-yellow-500" },
    error: { label: "Error", variant: "destructive" as const, color: "bg-red-500" },
    success: { label: "Success", variant: "default" as const, color: "bg-green-500" },
    warning: { label: "Warning", variant: "outline" as const, color: "bg-orange-500" }
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn("gap-1", className)}>
      <div className={cn("w-2 h-2 rounded-full", config.color)} />
      {config.label}
    </Badge>
  );
}

// Priority indicators  
export function PriorityBadge({ 
  priority,
  className 
}: { 
  priority: "low" | "medium" | "high" | "urgent";
  className?: string;
}) {
  const priorityConfig = {
    low: { label: "Low", color: "text-blue-600 bg-blue-100 border-blue-200" },
    medium: { label: "Medium", color: "text-yellow-600 bg-yellow-100 border-yellow-200" },
    high: { label: "High", color: "text-orange-600 bg-orange-100 border-orange-200" },
    urgent: { label: "Urgent", color: "text-red-600 bg-red-100 border-red-200" }
  };

  const config = priorityConfig[priority];

  return (
    <Badge 
      variant="outline"
      className={cn(
        "text-xs font-medium border",
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

// Elevated card with consistent shadows
export function ElevatedCard({ 
  children,
  level = 1,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  level?: 1 | 2 | 3;
}) {
  const shadowClasses = {
    1: "shadow-sm hover:shadow-md",
    2: "shadow-md hover:shadow-lg", 
    3: "shadow-lg hover:shadow-xl"
  };

  return (
    <Card 
      className={cn(
        "transition-shadow duration-200",
        shadowClasses[level],
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

// Visual separators
export function VisualSeparator({ 
  orientation = "horizontal",
  spacing = "md",
  className 
}: {
  orientation?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
  className?: string;
}) {
  const spacingClasses = {
    horizontal: {
      sm: "my-4",
      md: "my-6", 
      lg: "my-8"
    },
    vertical: {
      sm: "mx-4",
      md: "mx-6",
      lg: "mx-8"
    }
  };

  return (
    <div className={cn(
      orientation === "horizontal" ? "w-full h-px bg-border" : "w-px h-full bg-border",
      spacingClasses[orientation][spacing],
      className
    )} />
  );
}

// Color palette showcase (for design system documentation)
export function ColorPalette() {
  const colors = [
    { name: "Primary", class: "bg-primary", textClass: "text-primary-foreground" },
    { name: "Secondary", class: "bg-secondary", textClass: "text-secondary-foreground" },
    { name: "Muted", class: "bg-muted", textClass: "text-muted-foreground" },
    { name: "Accent", class: "bg-accent", textClass: "text-accent-foreground" },
    { name: "Destructive", class: "bg-destructive", textClass: "text-destructive-foreground" },
    { name: "Border", class: "bg-border", textClass: "text-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {colors.map(color => (
        <Card key={color.name} className={cn("p-4", color.class)}>
          <p className={cn("font-medium", color.textClass)}>{color.name}</p>
        </Card>
      ))}
    </div>
  );
}

// Typography scale showcase
export function TypographyScale() {
  return (
    <div className="space-y-4">
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <P>Paragraph text with good readability and proper line height for comfortable reading experience.</P>
      <Lead>Lead text that provides emphasis and draws attention to important content.</Lead>
      <Muted>Muted text for secondary information and less important details.</Muted>
      <Small>Small text for fine print and additional metadata.</Small>
    </div>
  );
}

// Spacing scale showcase  
export function SpacingScale() {
  return (
    <div className="space-y-4">
      <div>
        <Small>Extra Small (xs)</Small>
        <div className="bg-muted h-2 w-full mt-1" />
        <Space size="xs" />
      </div>
      
      <div>
        <Small>Small (sm)</Small>
        <div className="bg-muted h-2 w-full mt-1" />
        <Space size="sm" />
      </div>
      
      <div>
        <Small>Medium (md)</Small>
        <div className="bg-muted h-2 w-full mt-1" />
        <Space size="md" />
      </div>
      
      <div>
        <Small>Large (lg)</Small>
        <div className="bg-muted h-2 w-full mt-1" />
        <Space size="lg" />
      </div>
      
      <div>
        <Small>Extra Large (xl)</Small>
        <div className="bg-muted h-2 w-full mt-1" />
        <Space size="xl" />
      </div>
    </div>
  );
}