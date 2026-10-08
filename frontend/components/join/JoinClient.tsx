"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Video, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JoinClient() {
  const router = useRouter();
  const [meetingCode, setMeetingCode] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingCode.trim()) return;
    
    let code = meetingCode.trim();
    try {
      if (code.startsWith("http")) {
        const url = new URL(code);
        const parts = url.pathname.split("/");
        code = parts[parts.length - 1];
      }
    } catch (e) {
      // Not a URL, use as is
    }

    router.push(`/meeting/${code}`);
  };

  return (
    <div className="w-full max-w-[480px]">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>
      
      <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-xl shadow-black/5 p-8 md:p-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 ring-8 ring-white">
            <Video className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">Join a Meeting</h1>
          <p className="text-[var(--color-text-secondary)]">Enter your meeting code or personal link to join the room.</p>
        </div>

        <form onSubmit={handleJoin} className="flex flex-col gap-6">
          <div>
            <label htmlFor="meetingId" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
              Meeting ID or Link
            </label>
            <input
              id="meetingId"
              type="text"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              placeholder="e.g. 84739261504 or url"
              className="w-full px-4 py-3 bg-gray-50 border border-[var(--color-border)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all font-medium text-lg"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!meetingCode.trim()}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-[var(--color-primary)] focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] shadow-md hover:shadow-lg cursor-pointer"
          >
            Join Meeting
          </button>
        </form>
      </div>
    </div>
  );
}
