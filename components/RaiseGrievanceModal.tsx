"use client";
import React, { useState } from "react";

export default function RaiseGrievanceModal({ isOpen, onClose, customerId, orderId }: { isOpen: boolean, onClose: () => void, customerId: string, orderId?: string }) {
  const [formData, setFormData] = useState({
    category: "Delivery Delay",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use deployed backend URL
      const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app").replace(/\/$/, "");
      const response = await fetch(`${API_BASE}/api/grievances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, customerId, orderId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit grievance");

      setSuccess("Your grievance has been successfully submitted (ID: " + data.data.grievanceId + ").");
      setFormData({ category: "Delivery Delay", description: "" });
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Raise a Grievance</h2>

        {success && <div className="mb-4 text-green-600 bg-green-50 p-2 rounded">{success}</div>}
        {error && <div className="mb-4 text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-orange-500"
            >
              <option value="Delivery Delay">Delivery Delay</option>
              <option value="Product Quality Issue">Product Quality Issue</option>
              <option value="Missing Item">Missing Item</option>
              <option value="Wrong Product">Wrong Product</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-orange-500"
              placeholder="Please describe your issue in detail..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
            >
              {loading ? "Submitting..." : "Submit Grievance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
