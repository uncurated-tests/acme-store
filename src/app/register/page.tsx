"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    subscribeNewsletter: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.password) errors.password = "Password is required";
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!form.acceptTerms) errors.acceptTerms = "You must accept the terms";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setError(null);
    setLoading(true);

    try {
      const result = await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        acceptTerms: form.acceptTerms,
        subscribeNewsletter: form.subscribeNewsletter,
      });

      if (result.success) {
        if (result.token) {
          localStorage.setItem("auth_token", result.token);
        }
        router.push("/account");
      } else {
        setError(result.error || "Registration failed");
        if (result.validationErrors) {
          setFieldErrors(result.validationErrors);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white">
              <span className="text-lg font-bold text-white dark:text-zinc-900">A</span>
            </div>
            <span className="text-xl font-semibold text-zinc-900 dark:text-white">Acme Store</span>
          </Link>
        </div>

        <Card padding="lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create an account</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Join us and start shopping
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First name"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                error={fieldErrors.firstName}
                required
              />
              <Input
                label="Last name"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                error={fieldErrors.lastName}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={fieldErrors.email}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              error={fieldErrors.password}
              hint="At least 8 characters with uppercase, lowercase, number, and special character"
              required
            />

            <Input
              label="Confirm password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              error={fieldErrors.confirmPassword}
              required
            />

            <div className="space-y-3">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={(e) => updateField("acceptTerms", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-zinc-900 hover:underline dark:text-white">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-zinc-900 hover:underline dark:text-white">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {fieldErrors.acceptTerms && (
                <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.acceptTerms}</p>
              )}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.subscribeNewsletter}
                  onChange={(e) => updateField("subscribeNewsletter", e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Subscribe to our newsletter for updates and offers
                </span>
              </label>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" fullWidth>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </Button>
            <Button variant="outline" fullWidth>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Button>
            <Button variant="outline" fullWidth>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-zinc-900 hover:underline dark:text-white"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
