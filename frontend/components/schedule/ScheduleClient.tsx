"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createMeeting } from "@/lib/api";

export default function ScheduleClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();
      await createMeeting({
        title: formData.title,
        description: formData.description,
        type: "scheduled",
        duration_minutes: formData.duration,
        scheduled_at: scheduledAt,
      });
      
      alert("Meeting scheduled successfully!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to schedule meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[560px]">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>
      
      <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-xl shadow-black/5 p-8 md:p-10">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[var(--color-border)]">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Calendar className="w-7 h-7 text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Schedule Meeting</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Plan ahead and invite your team.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">Meeting Topic</label>
            <input
              type="text"
              required
              placeholder="e.g. Weekly Product Sync"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-[var(--color-border)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">Description <span className="font-normal text-gray-400">(Optional)</span></label>
            <textarea
              placeholder="What is this meeting about?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-[var(--color-border)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-[var(--color-border)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all font-medium"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">Time</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-[var(--color-border)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">Duration</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-[var(--color-border)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 hr</option>
                  <option value={120}>2 hr</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-6 border-t border-[var(--color-border)] flex gap-4">
             <button
              type="button"
              onClick={() => router.push("/")}
              className="px-6 py-3.5 border border-[var(--color-border)] hover:bg-gray-50 text-[var(--color-text-primary)] font-semibold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-[var(--color-primary)] focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? "Saving..." : "Schedule Meeting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
