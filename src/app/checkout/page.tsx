"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Input, Select, Card } from "@/components/ui";

interface CheckoutForm {
  // Contact
  email: string;
  phone: string;
  // Shipping
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  // Payment
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

type CheckoutStep = "information" | "shipping" | "payment";

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>("information");
  const [form, setForm] = useState<CheckoutForm>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [processing, setProcessing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");

  // Mock cart data
  const cartItems = [
    {
      id: "1",
      name: "Wireless Noise-Canceling Headphones",
      price: 299.99,
      quantity: 1,
      image: "/products/headphones-thumb.jpg",
    },
    {
      id: "2",
      name: "Ultra-Slim Laptop Stand",
      price: 79.99,
      quantity: 2,
      image: "/products/stand-thumb.jpg",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingMethod === "express" ? 14.99 : shippingMethod === "overnight" ? 29.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const updateForm = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (currentStep: CheckoutStep): boolean => {
    const newErrors: Partial<CheckoutForm> = {};

    if (currentStep === "information") {
      if (!form.email) newErrors.email = "Email is required";
      if (!form.firstName) newErrors.firstName = "First name is required";
      if (!form.lastName) newErrors.lastName = "Last name is required";
      if (!form.address) newErrors.address = "Address is required";
      if (!form.city) newErrors.city = "City is required";
      if (!form.state) newErrors.state = "State is required";
      if (!form.postalCode) newErrors.postalCode = "Postal code is required";
    }

    if (currentStep === "payment") {
      if (!form.cardNumber) newErrors.cardNumber = "Card number is required";
      if (!form.cardName) newErrors.cardName = "Name on card is required";
      if (!form.expiry) newErrors.expiry = "Expiry date is required";
      if (!form.cvv) newErrors.cvv = "CVV is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep(step)) {
      if (step === "information") setStep("shipping");
      else if (step === "shipping") setStep("payment");
    }
  };

  const handleSubmit = async () => {
    if (!validateStep("payment")) return;

    setProcessing(true);
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Would redirect to order confirmation
    window.location.href = "/order-confirmation";
  };

  const steps = [
    { id: "information", label: "Information" },
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
              <span className="text-sm font-bold text-white dark:text-zinc-900">A</span>
            </div>
            <span className="text-lg font-semibold text-zinc-900 dark:text-white">
              Acme Store
            </span>
          </Link>
          <Link href="/cart" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
            Return to cart
          </Link>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1">
            {/* Progress Steps */}
            <nav className="mb-8">
              <ol className="flex items-center gap-2">
                {steps.map((s, index) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (index < steps.findIndex((x) => x.id === step)) {
                          setStep(s.id as CheckoutStep);
                        }
                      }}
                      className={`text-sm font-medium ${
                        s.id === step
                          ? "text-zinc-900 dark:text-white"
                          : index < steps.findIndex((x) => x.id === step)
                          ? "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          : "text-zinc-400 dark:text-zinc-600"
                      }`}
                    >
                      {s.label}
                    </button>
                    {index < steps.length - 1 && (
                      <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* Information Step */}
            {step === "information" && (
              <div className="space-y-6">
                <Card>
                  <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      error={errors.email}
                      required
                    />
                    <Input
                      label="Phone (optional)"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                    />
                  </div>
                </Card>

                <Card>
                  <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="First name"
                        value={form.firstName}
                        onChange={(e) => updateForm("firstName", e.target.value)}
                        error={errors.firstName}
                        required
                      />
                      <Input
                        label="Last name"
                        value={form.lastName}
                        onChange={(e) => updateForm("lastName", e.target.value)}
                        error={errors.lastName}
                        required
                      />
                    </div>
                    <Input
                      label="Address"
                      value={form.address}
                      onChange={(e) => updateForm("address", e.target.value)}
                      error={errors.address}
                      required
                    />
                    <Input
                      label="Apartment, suite, etc. (optional)"
                      value={form.apartment}
                      onChange={(e) => updateForm("apartment", e.target.value)}
                    />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Input
                        label="City"
                        value={form.city}
                        onChange={(e) => updateForm("city", e.target.value)}
                        error={errors.city}
                        required
                      />
                      <Select
                        label="State"
                        value={form.state}
                        onChange={(e) => updateForm("state", e.target.value)}
                        error={errors.state}
                        options={[
                          { value: "", label: "Select state" },
                          { value: "CA", label: "California" },
                          { value: "NY", label: "New York" },
                          { value: "TX", label: "Texas" },
                          { value: "FL", label: "Florida" },
                        ]}
                        required
                      />
                      <Input
                        label="ZIP code"
                        value={form.postalCode}
                        onChange={(e) => updateForm("postalCode", e.target.value)}
                        error={errors.postalCode}
                        required
                      />
                    </div>
                  </div>
                </Card>

                <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
                  Continue to Shipping
                </Button>
              </div>
            )}

            {/* Shipping Step */}
            {step === "shipping" && (
              <div className="space-y-6">
                <Card>
                  <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                    Shipping Method
                  </h2>
                  <div className="space-y-3">
                    {[
                      { id: "standard", label: "Standard Shipping", price: "Free", time: "5-7 business days" },
                      { id: "express", label: "Express Shipping", price: "$14.99", time: "2-3 business days" },
                      { id: "overnight", label: "Overnight Shipping", price: "$29.99", time: "1 business day" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                          shippingMethod === method.id
                            ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800"
                            : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={shippingMethod === method.id}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                          />
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white">{method.label}</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{method.time}</p>
                          </div>
                        </div>
                        <span className="font-medium text-zinc-900 dark:text-white">{method.price}</span>
                      </label>
                    ))}
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button variant="outline" size="lg" onClick={() => setStep("information")}>
                    Back
                  </Button>
                  <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <div className="space-y-6">
                <Card>
                  <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Card number"
                      value={form.cardNumber}
                      onChange={(e) => updateForm("cardNumber", e.target.value)}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    <Input
                      label="Name on card"
                      value={form.cardName}
                      onChange={(e) => updateForm("cardName", e.target.value)}
                      error={errors.cardName}
                      required
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Expiry date"
                        value={form.expiry}
                        onChange={(e) => updateForm("expiry", e.target.value)}
                        error={errors.expiry}
                        placeholder="MM/YY"
                        required
                      />
                      <Input
                        label="CVV"
                        value={form.cvv}
                        onChange={(e) => updateForm("cvv", e.target.value)}
                        error={errors.cvv}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button variant="outline" size="lg" onClick={() => setStep("shipping")}>
                    Back
                  </Button>
                  <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} loading={processing}>
                    {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96">
            <Card className="sticky top-8">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <div className="absolute right-0 top-0 flex h-5 w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-zinc-500 text-xs text-white">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-zinc-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-b border-zinc-200 py-4 text-sm dark:border-zinc-800">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 text-base font-semibold text-zinc-900 dark:text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
