"use client";

import { Meeting } from "@/types/meeting";
import MeetingCard from "./MeetingCard";

export default function RecentMeetings({ meetings }: { meetings: Meeting[] }) {
  return (
    <div>
      {meetings.length === 0 ? (
        <p className="text-[var(--color-text-secondary)] text-sm">No recent meetings found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} isRecent={true} />
          ))}
        </div>
      )}
    </div>
  );
}
