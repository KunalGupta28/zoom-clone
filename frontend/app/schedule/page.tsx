"use client";

import AppShell from "@/components/shell/AppShell";
import ScheduleClient from "@/components/schedule/ScheduleClient";

export default function SchedulePage() {
  return (
    <AppShell>
      <div className="flex h-full w-full items-center justify-center p-6 md:p-10 bg-[#FAFAFA]">
        <ScheduleClient />
      </div>
    </AppShell>
  );
}
