"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Card, Badge, StatusBadge } from "@/components/ui";

type Tab = "overview" | "orders" | "addresses" | "settings";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Mock user data
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    avatar: null,
    memberSince: "January 2023",
    totalOrders: 12,
    totalSpent: 2456.78,
  };

  // Mock orders
  const orders = [
    {
      id: "ORD-ABC123",
      date: "Jan 15, 2024",
      status: "delivered" as const,
      total: 459.97,
      items: 3,
    },
    {
      id: "ORD-DEF456",
      date: "Jan 10, 2024",
      status: "shipped" as const,
      total: 129.99,
      items: 1,
    },
    {
      id: "ORD-GHI789",
      date: "Dec 28, 2023",
      status: "delivered" as const,
      total: 89.99,
      items: 2,
    },
  ];

  const tabs = [
    { id: "overview" as Tab, label: "Overview" },
    { id: "orders" as Tab, label: "Orders" },
    { id: "addresses" as Tab, label: "Addresses" },
    { id: "settings" as Tab, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">My Account</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Welcome back, {user.firstName}!
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-64">
            <Card padding="sm">
              {/* User Info */}
              <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <span className="text-lg font-medium text-zinc-600 dark:text-zinc-300">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Logout */}
              <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                <Button variant="outline" fullWidth size="sm">
                  Sign Out
                </Button>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Orders</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                      {user.totalOrders}
                    </p>
                  </Card>
                  <Card>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Spent</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                      ${user.totalSpent.toFixed(2)}
                    </p>
                  </Card>
                  <Card>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Member Since</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                      {user.memberSince}
                    </p>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      Recent Orders
                    </h2>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      View all
                    </button>
                  </div>
                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-4">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{order.id}</p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {order.date} &middot; {order.items} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-zinc-900 dark:text-white">
                            ${order.total.toFixed(2)}
                          </p>
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                    Quick Actions
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Link href="/products">
                      <Button variant="outline" fullWidth>
                        Browse Products
                      </Button>
                    </Link>
                    <Link href="/wishlist">
                      <Button variant="outline" fullWidth>
                        View Wishlist
                      </Button>
                    </Link>
                    <button onClick={() => setActiveTab("addresses")}>
                      <Button variant="outline" fullWidth>
                        Manage Addresses
                      </Button>
                    </button>
                    <button onClick={() => setActiveTab("settings")}>
                      <Button variant="outline" fullWidth>
                        Account Settings
                      </Button>
                    </button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "orders" && (
              <Card>
                <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                  Order History
                </h2>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">{order.id}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {order.date} &middot; {order.items} items
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={order.status} />
                        <p className="font-medium text-zinc-900 dark:text-white">
                          ${order.total.toFixed(2)}
                        </p>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "addresses" && (
              <Card>
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Saved Addresses
                  </h2>
                  <Button variant="primary" size="sm">
                    Add Address
                  </Button>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-medium text-zinc-900 dark:text-white">Home</span>
                      <Badge variant="primary" size="sm">Default</Badge>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      John Doe<br />
                      123 Main Street, Apt 4B<br />
                      San Francisco, CA 94102<br />
                      United States
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                    <div className="mb-2">
                      <span className="font-medium text-zinc-900 dark:text-white">Work</span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      John Doe<br />
                      456 Office Plaza, Suite 100<br />
                      San Francisco, CA 94105<br />
                      United States
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                      <Button variant="ghost" size="sm">Set as Default</Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card>
                  <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                    Personal Information
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="First name" defaultValue={user.firstName} />
                    <Input label="Last name" defaultValue={user.lastName} />
                    <Input label="Email" type="email" defaultValue={user.email} />
                    <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="mt-4">
                    <Button variant="primary">Save Changes</Button>
                  </div>
                </Card>

                <Card>
                  <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                    Change Password
                  </h2>
                  <div className="space-y-4">
                    <Input label="Current password" type="password" />
                    <Input label="New password" type="password" />
                    <Input label="Confirm new password" type="password" />
                  </div>
                  <div className="mt-4">
                    <Button variant="primary">Update Password</Button>
                  </div>
                </Card>

                <Card>
                  <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                    Preferences
                  </h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Email notifications</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Receive order updates and shipping notifications
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-zinc-300" />
                    </label>
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Marketing emails</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Receive promotions, deals, and product recommendations
                        </p>
                      </div>
                      <input type="checkbox" className="h-5 w-5 rounded border-zinc-300" />
                    </label>
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">SMS notifications</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Receive text messages for important updates
                        </p>
                      </div>
                      <input type="checkbox" className="h-5 w-5 rounded border-zinc-300" />
                    </label>
                  </div>
                </Card>

                <Card>
                  <h2 className="mb-4 text-lg font-semibold text-red-600 dark:text-red-400">
                    Danger Zone
                  </h2>
                  <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="danger">Delete Account</Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
