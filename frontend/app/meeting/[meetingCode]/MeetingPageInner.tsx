"use client";

import { useParams } from "next/navigation";
import MeetingClient from "@/components/meeting/MeetingClient";

export default function MeetingPageInner() {
  const params = useParams();
  const meetingCode = params.meetingCode as string;

  return (
    <main className="h-screen w-screen bg-[var(--color-meeting-bg)] overflow-hidden">
      <MeetingClient meetingCode={meetingCode} />
    </main>
  );
}
