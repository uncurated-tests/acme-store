"use client";

import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  dot?: boolean;
}

const variantStyles = {
  default: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
  primary: "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900",
  secondary: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

const dotColors = {
  default: "bg-zinc-500",
  primary: "bg-zinc-900 dark:bg-white",
  secondary: "bg-zinc-600",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      rounded = false,
      dot = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5 font-medium
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${rounded ? "rounded-full" : "rounded"}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

// Status Badge for orders
export interface StatusBadgeProps {
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "returned";
}

const statusConfig: Record<StatusBadgeProps["status"], { variant: BadgeProps["variant"]; label: string }> = {
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "info", label: "Confirmed" },
  processing: { variant: "info", label: "Processing" },
  shipped: { variant: "primary", label: "Shipped" },
  delivered: { variant: "success", label: "Delivered" },
  cancelled: { variant: "danger", label: "Cancelled" },
  refunded: { variant: "secondary", label: "Refunded" },
  returned: { variant: "secondary", label: "Returned" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} dot rounded>
      {config.label}
    </Badge>
  );
}
