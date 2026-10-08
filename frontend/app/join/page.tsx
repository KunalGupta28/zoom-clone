"use client";

import AppShell from "@/components/shell/AppShell";
import JoinClient from "@/components/join/JoinClient";

export default function JoinPage() {
  return (
    <AppShell>
      <div className="flex h-full w-full items-center justify-center p-6 md:p-10 bg-[#FAFAFA]">
        <JoinClient />
      </div>
    </AppShell>
  );
}
