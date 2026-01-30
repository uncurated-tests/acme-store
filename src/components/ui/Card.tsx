"use client";

import { HTMLAttributes, forwardRef, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

const variantStyles = {
  default: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
  outlined: "bg-transparent border border-zinc-300 dark:border-zinc-700",
  elevated: "bg-white dark:bg-zinc-900 shadow-lg",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hoverable = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-xl transition-all
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hoverable ? "hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Card subcomponents
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = "",
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between ${className}`} {...props}>
      <div>
        {title && (
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        )}
        {children}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mt-4 flex items-center justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
