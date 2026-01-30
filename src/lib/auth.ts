/**
 * Authentication Module
 * 
 * Handles user authentication, session management, and authorization
 */

import type { User, UserPreferences, Address, PaymentMethod } from "./types";

// Auth State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiresAt?: Date;
  error?: string;
  validationErrors?: Record<string, string>;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Mock user data
const mockUsers: Map<string, { user: User; passwordHash: string }> = new Map([
  [
    "demo@example.com",
    {
      user: {
        id: "user_001",
        email: "demo@example.com",
        firstName: "John",
        lastName: "Doe",
        avatar: "/avatars/default.png",
        phone: "+1 (555) 123-4567",
        dateOfBirth: new Date("1990-05-15"),
        preferences: {
          newsletter: true,
          smsNotifications: false,
          emailNotifications: true,
          currency: "USD",
          language: "en",
          theme: "system",
        },
        addresses: [
          {
            id: "addr_001",
            label: "Home",
            firstName: "John",
            lastName: "Doe",
            street1: "123 Main Street",
            street2: "Apt 4B",
            city: "San Francisco",
            state: "CA",
            postalCode: "94102",
            country: "US",
            phone: "+1 (555) 123-4567",
            isDefault: true,
            type: "both",
          },
        ],
        paymentMethods: [
          {
            id: "pm_001",
            type: "credit_card",
            last4: "4242",
            brand: "Visa",
            expiryMonth: 12,
            expiryYear: 2026,
            isDefault: true,
          },
        ],
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2024-06-01"),
        lastLoginAt: new Date(),
        emailVerified: true,
        role: "customer",
      },
      passwordHash: "hashed_demo123", // In real app, this would be bcrypt hashed
    },
  ],
]);

// Token storage simulation
const tokenStore = new Map<string, { userId: string; expiresAt: Date }>();

// Helper functions
function generateToken(): string {
  return `tok_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function generateRefreshToken(): string {
  return `ref_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return { valid: errors.length === 0, errors };
}

// Auth Functions
export async function login(credentials: LoginCredentials): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { email, password, rememberMe } = credentials;
  
  // Validate email format
  if (!validateEmail(email)) {
    return {
      success: false,
      error: "Invalid email format",
      validationErrors: { email: "Please enter a valid email address" },
    };
  }
  
  // Check if user exists
  const userData = mockUsers.get(email.toLowerCase());
  if (!userData) {
    return {
      success: false,
      error: "Invalid credentials",
      validationErrors: { email: "No account found with this email" },
    };
  }
  
  // Verify password (in real app, use bcrypt.compare)
  if (userData.passwordHash !== `hashed_${password}`) {
    return {
      success: false,
      error: "Invalid credentials",
      validationErrors: { password: "Incorrect password" },
    };
  }
  
  // Generate tokens
  const token = generateToken();
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000);
  
  // Store token
  tokenStore.set(token, { userId: userData.user.id, expiresAt });
  
  // Update last login
  userData.user.lastLoginAt = new Date();
  
  return {
    success: true,
    user: userData.user,
    token,
    refreshToken,
    expiresAt,
  };
}

export async function register(data: RegisterData): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const validationErrors: Record<string, string> = {};
  
  // Validate email
  if (!validateEmail(data.email)) {
    validationErrors.email = "Please enter a valid email address";
  }
  
  // Check if email already exists
  if (mockUsers.has(data.email.toLowerCase())) {
    validationErrors.email = "An account with this email already exists";
  }
  
  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    validationErrors.password = passwordValidation.errors[0];
  }
  
  // Validate name
  if (!data.firstName.trim()) {
    validationErrors.firstName = "First name is required";
  }
  if (!data.lastName.trim()) {
    validationErrors.lastName = "Last name is required";
  }
  
  // Validate terms acceptance
  if (!data.acceptTerms) {
    validationErrors.acceptTerms = "You must accept the terms and conditions";
  }
  
  if (Object.keys(validationErrors).length > 0) {
    return {
      success: false,
      error: "Validation failed",
      validationErrors,
    };
  }
  
  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}`,
    email: data.email.toLowerCase(),
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    preferences: {
      newsletter: data.subscribeNewsletter || false,
      smsNotifications: false,
      emailNotifications: true,
      currency: "USD",
      language: "en",
      theme: "system",
    },
    addresses: [],
    paymentMethods: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    emailVerified: false,
    role: "customer",
  };
  
  // Store user
  mockUsers.set(data.email.toLowerCase(), {
    user: newUser,
    passwordHash: `hashed_${data.password}`,
  });
  
  // Generate tokens
  const token = generateToken();
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  tokenStore.set(token, { userId: newUser.id, expiresAt });
  
  return {
    success: true,
    user: newUser,
    token,
    refreshToken,
    expiresAt,
  };
}

export async function logout(token: string): Promise<void> {
  tokenStore.delete(token);
}

export async function refreshAuth(refreshToken: string): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In real app, validate refresh token and issue new tokens
  // For mock, just generate new tokens
  const token = generateToken();
  const newRefreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  return {
    success: true,
    token,
    refreshToken: newRefreshToken,
    expiresAt,
  };
}

export async function validateToken(token: string): Promise<User | null> {
  const tokenData = tokenStore.get(token);
  
  if (!tokenData) {
    return null;
  }
  
  if (new Date() > tokenData.expiresAt) {
    tokenStore.delete(token);
    return null;
  }
  
  // Find user
  for (const [, userData] of mockUsers) {
    if (userData.user.id === tokenData.userId) {
      return userData.user;
    }
  }
  
  return null;
}

export async function requestPasswordReset(data: PasswordResetRequest): Promise<{ success: boolean; message: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Always return success to prevent email enumeration
  return {
    success: true,
    message: "If an account with that email exists, we've sent password reset instructions.",
  };
}

export async function confirmPasswordReset(data: PasswordResetConfirm): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (data.newPassword !== data.confirmPassword) {
    return {
      success: false,
      error: "Passwords do not match",
      validationErrors: { confirmPassword: "Passwords must match" },
    };
  }
  
  const passwordValidation = validatePassword(data.newPassword);
  if (!passwordValidation.valid) {
    return {
      success: false,
      error: "Invalid password",
      validationErrors: { newPassword: passwordValidation.errors[0] },
    };
  }
  
  // In real app, validate token and update password
  return {
    success: true,
  };
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<User, "firstName" | "lastName" | "phone" | "dateOfBirth" | "avatar">>
): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  for (const [, userData] of mockUsers) {
    if (userData.user.id === userId) {
      Object.assign(userData.user, updates, { updatedAt: new Date() });
      return { success: true, user: userData.user };
    }
  }
  
  return { success: false, error: "User not found" };
}

export async function updatePreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  for (const [, userData] of mockUsers) {
    if (userData.user.id === userId) {
      userData.user.preferences = { ...userData.user.preferences, ...preferences };
      userData.user.updatedAt = new Date();
      return { success: true, user: userData.user };
    }
  }
  
  return { success: false, error: "User not found" };
}

export async function addAddress(userId: string, address: Omit<Address, "id">): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  for (const [, userData] of mockUsers) {
    if (userData.user.id === userId) {
      const newAddress: Address = {
        ...address,
        id: `addr_${Date.now()}`,
      };
      
      // If setting as default, unset other defaults
      if (newAddress.isDefault) {
        userData.user.addresses.forEach(addr => {
          if (addr.type === newAddress.type || addr.type === "both" || newAddress.type === "both") {
            addr.isDefault = false;
          }
        });
      }
      
      userData.user.addresses.push(newAddress);
      userData.user.updatedAt = new Date();
      return { success: true, user: userData.user };
    }
  }
  
  return { success: false, error: "User not found" };
}

export async function updateAddress(
  userId: string,
  addressId: string,
  updates: Partial<Address>
): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  for (const [, userData] of mockUsers) {
    if (userData.user.id === userId) {
      const addressIndex = userData.user.addresses.findIndex(a => a.id === addressId);
      if (addressIndex === -1) {
        return { success: false, error: "Address not found" };
      }
      
      userData.user.addresses[addressIndex] = {
        ...userData.user.addresses[addressIndex],
        ...updates,
      };
      userData.user.updatedAt = new Date();
      return { success: true, user: userData.user };
    }
  }
  
  return { success: false, error: "User not found" };
}

export async function deleteAddress(userId: string, addressId: string): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  for (const [, userData] of mockUsers) {
    if (userData.user.id === userId) {
      userData.user.addresses = userData.user.addresses.filter(a => a.id !== addressId);
      userData.user.updatedAt = new Date();
      return { success: true, user: userData.user };
    }
  }
  
  return { success: false, error: "User not found" };
}

export async function addPaymentMethod(
  userId: string,
  paymentMethod: Omit<PaymentMethod, "id">
): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  for (const [, userData] of mockUsers) {
    if (userData.user.id === userId) {
      const newMethod: PaymentMethod = {
        ...paymentMethod,
        id: `pm_${Date.now()}`,
      };
      
      if (newMethod.isDefault) {
        userData.user.paymentMethods.forEach(pm => {
          pm.isDefault = false;
        });
      }
      
      userData.user.paymentMethods.push(newMethod);
      userData.user.updatedAt = new Date();
      return { success: true, user: userData.user };
    }
  }
  
  return { success: false, error: "User not found" };
}

export async function deletePaymentMethod(userId: string, paymentMethodId: string): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  for (const [, userData] of mockUsers) {
    if (userData.user.id === userId) {
      userData.user.paymentMethods = userData.user.paymentMethods.filter(
        pm => pm.id !== paymentMethodId
      );
      userData.user.updatedAt = new Date();
      return { success: true, user: userData.user };
    }
  }
  
  return { success: false, error: "User not found" };
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<AuthResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  for (const [email, userData] of mockUsers) {
    if (userData.user.id === userId) {
      // Verify current password
      if (userData.passwordHash !== `hashed_${currentPassword}`) {
        return {
          success: false,
          error: "Current password is incorrect",
          validationErrors: { currentPassword: "Current password is incorrect" },
        };
      }
      
      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: "Invalid new password",
          validationErrors: { newPassword: passwordValidation.errors[0] },
        };
      }
      
      // Update password
      userData.passwordHash = `hashed_${newPassword}`;
      userData.user.updatedAt = new Date();
      
      return { success: true, user: userData.user };
    }
  }
  
  return { success: false, error: "User not found" };
}

// OAuth helpers (stubs for social login)
export async function loginWithGoogle(): Promise<AuthResult> {
  // Would redirect to Google OAuth in real implementation
  return { success: false, error: "OAuth not implemented in demo" };
}

export async function loginWithFacebook(): Promise<AuthResult> {
  // Would redirect to Facebook OAuth in real implementation
  return { success: false, error: "OAuth not implemented in demo" };
}

export async function loginWithApple(): Promise<AuthResult> {
  // Would redirect to Apple OAuth in real implementation
  return { success: false, error: "OAuth not implemented in demo" };
}
