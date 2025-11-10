/**
 * Accessible Form Components
 *
 * Form components with comprehensive accessibility features:
 * - Proper labeling and description
 * - Error announcements
 * - Keyboard navigation
 * - ARIA attributes
 * - Focus management
 */

"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useAriaLive, generateId, buildAriaAttributes } from "@/hooks/use-accessibility";
import { FieldSet } from "@workspace/ui/components/field";
import { Label } from "@workspace/ui/components/label";

// Form Context
interface FormContextValue {
  errors: Record<string, string>;
  isSubmitting: boolean;
  touched: Record<string, boolean>;
}

const FormContext = React.createContext<FormContextValue>({
  errors: {},
  isSubmitting: false,
  touched: {},
});

export function useFormContext() {
  return React.useContext(FormContext);
}

export interface FormProviderProps {
  children: React.ReactNode;
  errors?: Record<string, string>;
  isSubmitting?: boolean;
  touched?: Record<string, boolean>;
}

export function FormProvider({ children, errors = {}, isSubmitting = false, touched = {} }: FormProviderProps) {
  return <FormContext.Provider value={{ errors, isSubmitting, touched }}>{children}</FormContext.Provider>;
}

// Field Group Component
export interface FieldGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function FieldGroup({ children, className }: FieldGroupProps) {
  return (
    <FieldSet className={cn("space-y-2", className)} role="group">
      {children}
    </FieldSet>
  );
}

// Label Component
export interface AccessibleLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

export function AccessibleLabel({ required, children, className, ...props }: AccessibleLabelProps) {
  return (
    <Label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </Label>
  );
}

// Input Component
const inputVariants = cva(
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

export interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  description?: string;
  showPasswordToggle?: boolean;
  success?: boolean;
  errorMessage?: string;
}

export const AccessibleInput = React.forwardRef<HTMLInputElement, AccessibleInputProps>(
  (
    {
      name,
      label,
      description,
      showPasswordToggle = false,
      success = false,
      errorMessage: propErrorMessage,
      className,
      type: propType = "text",
      required,
      ...props
    },
    ref,
  ) => {
    const { errors, touched } = useFormContext();
    const { announce } = useAriaLive();
    const [showPassword, setShowPassword] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    // Generate IDs
    const inputId = React.useMemo(() => generateId(`input-${name}`), [name]);
    const descriptionId = React.useMemo(
      () => (description ? generateId(`desc-${name}`) : undefined),
      [name, description],
    );
    const errorId = React.useMemo(() => generateId(`error-${name}`), [name]);

    // Determine field state
    const fieldError = propErrorMessage || errors[name];
    const isError = Boolean(fieldError && touched[name]);
    const isSuccess = success && !isError && touched[name];
    const fieldState = isError ? "error" : isSuccess ? "success" : "default";

    // Determine input type
    const inputType = showPasswordToggle && showPassword ? "text" : propType;

    // Announce errors to screen readers
    React.useEffect(() => {
      if (isError && fieldError) {
        announce(`Error in ${label || name}: ${fieldError}`, { politeness: "assertive" });
      }
    }, [isError, fieldError, label, name, announce]);

    const handlePasswordToggle = () => {
      setShowPassword(!showPassword);
      announce(showPassword ? "Password hidden" : "Password visible", { politeness: "polite" });
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      props.onBlur?.(e);
    };

    // Build ARIA attributes
    const ariaAttributes = buildAriaAttributes({
      "aria-describedby": [descriptionId, isError ? errorId : undefined].filter(Boolean).join(" ") || undefined,
      "aria-invalid": isError,
      "aria-required": required,
    });

    return (
      <FieldGroup>
        {label && (
          <AccessibleLabel htmlFor={inputId} required={required}>
            {label}
          </AccessibleLabel>
        )}

        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={inputType}
            required={required}
            className={cn(inputVariants({ state: fieldState }), className)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...ariaAttributes}
            {...props}
          />

          {showPasswordToggle && propType === "password" && (
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {isSuccess && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
            </div>
          )}
        </div>

        {isError && fieldError && (
          <div
            id={errorId}
            role="alert"
            aria-live="polite"
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <span>{fieldError}</span>
          </div>
        )}
      </FieldGroup>
    );
  },
);

AccessibleInput.displayName = "AccessibleInput";

// Textarea Component
export interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export const AccessibleTextarea = React.forwardRef<HTMLTextAreaElement, AccessibleTextareaProps>(
  (
    {
      name,
      label,
      description,
      errorMessage: propErrorMessage,
      maxLength,
      showCharacterCount = false,
      className,
      required,
      value,
      ...props
    },
    ref,
  ) => {
    const { errors, touched } = useFormContext();
    const { announce } = useAriaLive();

    // Generate IDs
    const textareaId = React.useMemo(() => generateId(`textarea-${name}`), [name]);
    const descriptionId = React.useMemo(
      () => (description ? generateId(`desc-${name}`) : undefined),
      [name, description],
    );
    const errorId = React.useMemo(() => generateId(`error-${name}`), [name]);
    const countId = React.useMemo(
      () => (showCharacterCount ? generateId(`count-${name}`) : undefined),
      [name, showCharacterCount],
    );

    // Determine field state
    const fieldError = propErrorMessage || errors[name];
    const isError = Boolean(fieldError && touched[name]);

    const currentLength = typeof value === "string" ? value.length : 0;
    const remainingChars = maxLength ? maxLength - currentLength : undefined;

    // Announce character count warnings
    React.useEffect(() => {
      if (maxLength && remainingChars !== undefined && remainingChars <= 10 && remainingChars > 0) {
        announce(`${remainingChars} characters remaining`, { politeness: "polite" });
      } else if (remainingChars === 0) {
        announce("Character limit reached", { politeness: "assertive" });
      }
    }, [remainingChars, maxLength, announce]);

    // Build ARIA attributes
    const ariaAttributes = buildAriaAttributes({
      "aria-describedby":
        [descriptionId, countId, isError ? errorId : undefined].filter(Boolean).join(" ") || undefined,
      "aria-invalid": isError,
      "aria-required": required,
    });

    return (
      <FieldGroup>
        {label && (
          <AccessibleLabel htmlFor={textareaId} required={required}>
            {label}
          </AccessibleLabel>
        )}

        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          required={required}
          maxLength={maxLength}
          value={value}
          className={cn(
            "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            isError && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          {...ariaAttributes}
          {...props}
        />

        {showCharacterCount && maxLength && (
          <div
            id={countId}
            className={cn(
              "text-sm text-muted-foreground text-right",
              remainingChars !== undefined && remainingChars <= 10 && "text-orange-500",
              remainingChars === 0 && "text-destructive",
            )}
          >
            {currentLength}/{maxLength}
          </div>
        )}

        {isError && fieldError && (
          <div
            id={errorId}
            role="alert"
            aria-live="polite"
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <span>{fieldError}</span>
          </div>
        )}
      </FieldGroup>
    );
  },
);

AccessibleTextarea.displayName = "AccessibleTextarea";
