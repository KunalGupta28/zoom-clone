"use client";

import AppShell from "@/components/shell/AppShell";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="flex h-full w-full bg-white text-gray-900">
        
        {/* Secondary Pane */}
        <div className="w-[280px] border-r border-[var(--color-border)] flex flex-col h-full bg-[#FAFAFA] shrink-0">
          <div className="p-4 border-b border-[var(--color-border)]">
             <h2 className="font-semibold text-lg">Settings</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-1 text-sm font-medium text-gray-700">
             <div className="flex items-center gap-2 p-2 bg-[#EBF1FF] text-[#0B5CFF] rounded-lg cursor-pointer">General</div>
             <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">Video</div>
             <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">Audio</div>
             <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">Background & Effects</div>
             <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">Profile</div>
          </div>
        </div>

        {/* Detail Pane */}
        <div className="flex-1 bg-white p-8">
           <h3 className="text-xl font-semibold mb-6">General Settings</h3>
           <p className="text-gray-500 text-[15px]">Settings would appear here.</p>
        </div>
      </div>
    </AppShell>
  );
}
