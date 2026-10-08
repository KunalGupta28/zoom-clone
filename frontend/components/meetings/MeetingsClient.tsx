"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/shell/AppShell";
import { fetchUpcomingMeetings } from "@/lib/api";
import { Meeting } from "@/types/meeting";
import { getMeetingUrl } from "@/lib/urls";
import { useRouter } from "next/navigation";
import { RefreshCw, Play, Copy, Edit2 } from "lucide-react";

export default function MeetingsClient() {
  const router = useRouter();
  const [upcoming, setUpcoming] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const up = await fetchUpcomingMeetings();
        setUpcoming(up);
        if (up.length > 0) setSelectedMeeting(up[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCopyLink = () => {
    if (!selectedMeeting) return;
    navigator.clipboard.writeText(getMeetingUrl(selectedMeeting.meeting_code));
    alert("Invite link copied!");
  };

  const formatCode = (code: string) => code.match(/.{1,3}/g)?.join(' ') || code;

  return (
    <AppShell>
      <div className="flex h-full w-full bg-white text-gray-900">
        
        {/* Secondary Pane (List) */}
        <div className="w-[360px] border-r border-[var(--color-border)] flex flex-col h-full bg-[#FAFAFA] shrink-0">
          <div className="h-[52px] border-b border-[var(--color-border)] flex items-center justify-between px-4">
            <h2 className="font-semibold text-[15px]">Upcoming</h2>
            <button className="text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {loading ? (
              <div className="text-center py-10 text-sm text-gray-500">Loading...</div>
            ) : upcoming.length === 0 ? (
              <div className="text-center py-10 text-sm text-gray-500">No upcoming meetings</div>
            ) : (
              upcoming.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMeeting(m)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all cursor-pointer text-center ${
                    selectedMeeting?.id === m.id
                      ? "bg-[#0B5CFF] text-white shadow-md"
                      : "bg-white border border-[var(--color-border)] hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className={`font-semibold text-lg ${selectedMeeting?.id === m.id ? "text-white" : "text-[#0B5CFF]"}`}>
                    {formatCode(m.meeting_code)}
                  </div>
                  <div className={`text-xs mt-1 font-medium ${selectedMeeting?.id === m.id ? "text-blue-100" : "text-gray-500"}`}>
                    {m.title}
                  </div>
                </button>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-[var(--color-border)] text-center">
            <button className="text-sm font-semibold text-[#0B5CFF] hover:underline cursor-pointer">
              Add a calendar
            </button>
          </div>
        </div>

        {/* Detail Pane */}
        <div className="flex-1 bg-white p-8 overflow-y-auto">
          {selectedMeeting ? (
            <div className="max-w-3xl">
              <h1 className="text-[28px] font-bold text-gray-900 mb-8">{selectedMeeting.title}</h1>
              
              <div className="text-[15px] text-gray-800 font-medium mb-10 flex items-center gap-2">
                 <span>{formatCode(selectedMeeting.meeting_code)}</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => router.push(`/meeting/${selectedMeeting.meeting_code}`)}
                  className="bg-[#0B5CFF] hover:bg-[#0043C9] text-white text-sm font-semibold py-2 px-6 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Start
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Copy Invitation
                </button>
                <button 
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
              </div>

              <button className="text-[13px] font-medium text-[#0B5CFF] hover:underline cursor-pointer">
                Show Meeting Invitation
              </button>
            </div>
          ) : (
             <div className="flex items-center justify-center h-full text-gray-400">
                Select a meeting to view details
             </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}
