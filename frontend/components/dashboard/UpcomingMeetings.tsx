"use client";

import { Meeting } from "@/types/meeting";
import MeetingCard from "./MeetingCard";

export default function UpcomingMeetings({ meetings }: { meetings: Meeting[] }) {
  return (
    <div>
      {meetings.length === 0 ? (
        <p className="text-[var(--color-text-secondary)] text-sm">No upcoming meetings scheduled.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}
    </div>
  );
}
