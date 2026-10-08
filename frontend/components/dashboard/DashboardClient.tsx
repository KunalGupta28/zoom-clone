"use client";

import { useState, useEffect } from "react";
import AppShell from "../shell/AppShell";
import { Video, Plus, Calendar, CircleDot, FileText, PenLine, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { createMeeting } from "@/lib/api";
import { Meeting } from "@/types/meeting";
import { fetchUpcomingMeetings, fetchRecentMeetings } from "@/lib/api";
import MeetingCard from "./MeetingCard";

export default function DashboardClient() {
  const router = useRouter();
  const [time, setTime] = useState<Date | null>(null);
  const [loadingNew, setLoadingNew] = useState(false);
  
  const [upcoming, setUpcoming] = useState<Meeting[]>([]);
  const [recent, setRecent] = useState<Meeting[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [activeModal, setActiveModal] = useState<"recordings" | "summaries" | "notes" | null>(null);

  // Clock tick
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadMeetings = async () => {
    try {
      const [up, rec] = await Promise.all([
        fetchUpcomingMeetings(),
        fetchRecentMeetings(),
      ]);
      setUpcoming(up);
      setRecent(rec);
    } catch (error) {
      console.error("Failed to load meetings", error);
    } finally {
      setLoadingSchedule(false);
    }
  };

  // Fetch schedule
  useEffect(() => {
    loadMeetings();
  }, []);

  const handleNewMeeting = async () => {
    setLoadingNew(true);
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
      setLoadingNew(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-start min-h-full py-16 px-4 bg-[#FAFAFA]">
        
        {/* Giant Time & Date */}
        <div className="text-center mb-12 min-h-[100px]">
          {time ? (
            <>
              <h1 className="text-[56px] font-light text-gray-900 tracking-tight leading-none mb-2">
                {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </h1>
              <p className="text-[17px] text-gray-500 font-medium">
                {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </>
          ) : (
             <div className="animate-pulse flex flex-col items-center">
                <div className="h-[56px] w-48 bg-gray-200 rounded-lg mb-4 mt-2"></div>
                <div className="h-[20px] w-40 bg-gray-200 rounded-md"></div>
             </div>
          )}
        </div>

        {/* Three Central Meeting Actions */}
        <div className="flex items-start justify-center gap-6 mb-12">
          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={handleNewMeeting}
              disabled={loadingNew}
              className="w-[72px] h-[72px] rounded-3xl bg-[#FF742E] hover:bg-[#E56829] flex items-center justify-center text-white shadow-sm transition-colors cursor-pointer group disabled:opacity-70"
            >
              <Video className="w-8 h-8 group-hover:scale-105 transition-transform" strokeWidth={1.5} />
            </button>
            <div className="flex items-center text-[13px] font-semibold text-gray-700">
              New meeting <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={() => router.push("/join")}
              className="w-[72px] h-[72px] rounded-3xl bg-[#0B5CFF] hover:bg-[#0043C9] flex items-center justify-center text-white shadow-sm transition-colors cursor-pointer group"
            >
              <Plus className="w-8 h-8 group-hover:scale-105 transition-transform" strokeWidth={2} />
            </button>
            <span className="text-[13px] font-semibold text-gray-700">Join</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={() => router.push("/schedule")}
              className="w-[72px] h-[72px] rounded-3xl bg-[#0B5CFF] hover:bg-[#0043C9] flex items-center justify-center text-white shadow-sm transition-colors cursor-pointer group"
            >
              <Calendar className="w-7 h-7 group-hover:scale-105 transition-transform" strokeWidth={1.5} />
            </button>
            <span className="text-[13px] font-semibold text-gray-700">Schedule</span>
          </div>
        </div>

        {/* Quick Access Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button 
            onClick={() => setActiveModal("recordings")}
            className="flex items-center gap-2 bg-white border border-[var(--color-border)] rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <CircleDot className="w-4 h-4 text-red-500" strokeWidth={2} /> Recordings
          </button>
          <button 
            onClick={() => setActiveModal("summaries")}
            className="flex items-center gap-2 bg-white border border-[var(--color-border)] rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-500" strokeWidth={1.5} /> Summaries
          </button>
          <button 
            onClick={() => setActiveModal("notes")}
            className="flex items-center gap-2 bg-white border border-[var(--color-border)] rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <PenLine className="w-4 h-4 text-purple-500" strokeWidth={1.5} /> My Notes
          </button>
        </div>

        {/* Schedule Area */}
        <div className="w-full max-w-[800px] bg-white border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden min-h-[300px] p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Today's schedule</h2>
          </div>
          
          {loadingSchedule ? (
            <div className="flex items-center justify-center py-10">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B5CFF]"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming</h3>
                {upcoming.length === 0 ? (
                  <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 text-center border border-gray-100">No upcoming meetings today.</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {upcoming.map(m => <MeetingCard key={m.id} meeting={m} onRefresh={loadMeetings} />)}
                  </div>
                )}
              </div>
              
              {recent.length > 0 && (
                 <div>
                   <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent</h3>
                   <div className="flex flex-col gap-3">
                     {recent.map(m => <MeetingCard key={m.id} meeting={m} isRecent onRefresh={loadMeetings} />)}
                   </div>
                 </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Feature Coming Soon Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeModal === "recordings" && <CircleDot className="w-8 h-8 text-red-500" />}
                {activeModal === "summaries" && <FileText className="w-8 h-8 text-blue-500" />}
                {activeModal === "notes" && <PenLine className="w-8 h-8 text-purple-500" />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                {activeModal}
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                This feature is currently in development. You will be able to access your {activeModal} here soon!
              </p>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </AppShell>
  );
}
