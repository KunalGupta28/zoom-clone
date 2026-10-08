"use client";

import { Meeting } from "@/types/meeting";
import { Copy, MoreHorizontal, Video } from "lucide-react";
import { getMeetingUrl } from "@/lib/urls";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteMeeting, updateMeeting } from "@/lib/api";

interface MeetingCardProps {
  meeting: Meeting;
  isRecent?: boolean;
  onRefresh?: () => void;
}

export default function MeetingCard({ meeting, isRecent = false, onRefresh }: MeetingCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getMeetingUrl(meeting.meeting_code);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newTitle = window.prompt("Enter new meeting title:", meeting.title);
    if (newTitle && newTitle.trim() !== "" && newTitle !== meeting.title) {
      try {
        await updateMeeting(meeting.meeting_code, { title: newTitle });
        if (onRefresh) onRefresh();
      } catch (err) {
        alert("Failed to update meeting");
      }
    }
    setMenuOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Are you sure you want to delete "${meeting.title}"?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteMeeting(meeting.meeting_code);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert("Failed to delete meeting");
        setIsDeleting(false);
      }
    }
    setMenuOpen(false);
  };

  const formattedTime = meeting.scheduled_at 
    ? new Date(meeting.scheduled_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    : "Now";

  if (isDeleting) {
    return null;
  }

  // For both Upcoming and Recent, we use a compact row layout as requested
  return (
    <div className="group bg-white border border-transparent hover:border-gray-200 hover:shadow-sm rounded-lg p-3 flex items-start gap-4 transition-all border-b border-b-gray-100 last:border-b-transparent">
      
      {/* Time Column */}
      <div className="w-[80px] shrink-0 pt-1">
        <span className="text-[13px] font-semibold text-gray-900">{formattedTime}</span>
        {meeting.duration_minutes && (
          <div className="text-[11px] text-gray-500 font-medium">{meeting.duration_minutes} min</div>
        )}
      </div>

      {/* Title & Info Column */}
      <div className="flex-1 flex flex-col pt-1">
        <h3 className="font-semibold text-[15px] text-[#0B5CFF] group-hover:underline cursor-pointer inline-block w-fit" onClick={() => router.push(`/meeting/${meeting.meeting_code}`)}>
          {meeting.title}
        </h3>
        
        <div className="flex items-center gap-3 mt-1.5 text-[12px] text-gray-500 font-medium">
          <span className="flex items-center gap-1">
            Meeting ID: {meeting.meeting_code}
          </span>
          {meeting.description && (
             <>
               <span className="opacity-50">|</span>
               <span className="truncate max-w-[200px]">{meeting.description}</span>
             </>
          )}
        </div>
      </div>

      {/* Actions Column (Visible on hover or if not recent) */}
      <div className={`flex items-center gap-2 ${isRecent ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity pt-1 relative`}>
        <button 
          onClick={() => router.push(`/meeting/${meeting.meeting_code}`)}
          className="bg-[#0B5CFF] hover:bg-[#0043C9] text-white text-xs font-semibold py-1.5 px-4 rounded-full transition-colors cursor-pointer"
        >
          {isRecent ? "Join again" : "Start"}
        </button>
        
        <button 
          onClick={handleCopyLink}
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-full transition-colors cursor-pointer relative group/copy"
          title="Copy Invitation"
        >
          <Copy className="w-4 h-4" />
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>
        
        <div className="relative">
          <button 
             onClick={(e) => {
               e.stopPropagation();
               setMenuOpen(!menuOpen);
             }}
             className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-full transition-colors cursor-pointer"
          >
             <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-20 text-sm font-medium">
              <button 
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                onMouseDown={handleEdit}
              >
                Edit
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                onMouseDown={handleCopyLink}
              >
                Copy Invitation
              </button>
              <div className="h-px bg-gray-100 my-1"></div>
              <button 
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                onMouseDown={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
