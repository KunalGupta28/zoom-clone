"use client";

import { Video, Calendar, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createMeeting } from "@/lib/api";
import { useState } from "react";

export default function QuickActions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNewMeeting = async () => {
    setLoading(true);
    try {
      const meeting = await createMeeting({
        title: "Instant Meeting",
        duration_minutes: 60,
        type: "instant"
      });
      router.push(`/meeting/${meeting.meeting_code}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create meeting.");
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* New Meeting */}
      <button 
        onClick={handleNewMeeting}
        disabled={loading}
        className="cursor-pointer group relative overflow-hidden bg-[var(--color-primary)] text-white rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300">
          <Video className="w-24 h-24 transform rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold tracking-tight mb-1">
            {loading ? "Starting..." : "New Meeting"}
          </h3>
          <p className="text-white/80 text-sm font-medium">Start an instant meeting</p>
        </div>
      </button>

      {/* Join Meeting */}
      <button 
        onClick={() => router.push("/join")}
        className="cursor-pointer group bg-white border border-[var(--color-border)] rounded-2xl p-6 text-left transition-all hover:border-[var(--color-primary)] hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
      >
        <div className="w-12 h-12 bg-[var(--color-dashboard-bg)] rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
          <Plus className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] mb-1">
          Join Meeting
        </h3>
        <p className="text-[var(--color-text-secondary)] text-sm font-medium">Join with a code or link</p>
      </button>

      {/* Schedule */}
      <button 
        onClick={() => router.push("/schedule")}
        className="cursor-pointer group bg-white border border-[var(--color-border)] rounded-2xl p-6 text-left transition-all hover:border-[var(--color-primary)] hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
      >
        <div className="w-12 h-12 bg-[var(--color-dashboard-bg)] rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
          <Calendar className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] mb-1">
          Schedule
        </h3>
        <p className="text-[var(--color-text-secondary)] text-sm font-medium">Plan a future meeting</p>
      </button>
    </div>
  );
}
