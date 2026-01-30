"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftAddon,
      rightAddon,
      size = "md",
      fullWidth = true,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(7)}`;

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftAddon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              block rounded-lg border bg-white transition-colors
              focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-0
              disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500
              dark:bg-zinc-900 dark:text-white
              ${error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-zinc-300 focus:border-zinc-500 dark:border-zinc-700"
              }
              ${leftAddon ? "pl-10" : ""}
              ${rightAddon ? "pr-10" : ""}
              ${sizeStyles[size]}
              ${fullWidth ? "w-full" : ""}
              ${className}
            `}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightAddon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500">
              {rightAddon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Textarea variant
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, fullWidth = true, className = "", id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(7)}`;

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            block rounded-lg border bg-white px-4 py-2 text-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-0
            disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500
            dark:bg-zinc-900 dark:text-white
            ${error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-zinc-300 focus:border-zinc-500 dark:border-zinc-700"
            }
            ${fullWidth ? "w-full" : ""}
            ${className}
          `}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
