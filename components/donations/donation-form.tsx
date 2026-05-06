"use client";

import { useState } from "react";

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000, 25000, 50000];

export function DonationForm() {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const handlePresetClick = (value: number) => {
    setAmount(value.toString());
    setCustomAmount("");
    setSelectedPreset(value);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setAmount(value);
    setSelectedPreset(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numericAmount = parseFloat(amount);

    if (!donorName.trim()) {
      setError("Name is required");
      return;
    }
    if (!donorEmail.trim()) {
      setError("Email is required");
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/donations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          donorName,
          donorEmail,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to initialize payment");
      }

      const result = await response.json();

      window.location.href = result.data.authorizationUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize payment",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Select Amount</label>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                selectedPreset === preset
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-background hover:bg-accent"
              }`}
            >
              ₦{preset.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">
          Or Enter Custom Amount
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            ₦
          </span>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm"
            placeholder="0.00"
            min="1"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Your Name</label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email Address</label>
          <input
            type="email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !amount}
        className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Initializing Payment..."
          : `Donate ₦${parseFloat(amount || "0").toLocaleString()}`}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Secure payment powered by Paystack
      </p>
    </form>
  );
}
