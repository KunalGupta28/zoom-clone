"use client";

import AppShell from "@/components/shell/AppShell";
import { Search, ChevronDown, Plus, Settings } from "lucide-react";

export default function ChatPage() {
  return (
    <AppShell>
      <div className="flex h-full w-full bg-white text-gray-900">
        
        {/* Secondary Pane */}
        <div className="w-[360px] border-r border-[var(--color-border)] flex flex-col h-full bg-[#FAFAFA] shrink-0">
          <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
             <div className="flex items-center gap-1 font-semibold text-lg cursor-pointer">
               Chat <ChevronDown className="w-4 h-4 text-gray-500" />
             </div>
             <div className="flex items-center gap-2">
               <button className="text-gray-500 hover:bg-gray-200 p-1.5 rounded-md transition-colors"><Settings className="w-4 h-4" /></button>
               <button className="bg-[#0B5CFF] text-white p-1.5 rounded-full hover:bg-[#0043C9] transition-colors"><Plus className="w-4 h-4" /></button>
             </div>
          </div>
          
          <div className="p-3 flex items-center gap-2">
             <button className="bg-[#EBF1FF] text-[#0B5CFF] text-sm font-semibold px-4 py-1.5 rounded-full">All</button>
             <button className="text-gray-600 hover:bg-gray-200 text-sm font-semibold px-4 py-1.5 rounded-full">@</button>
             <button className="text-gray-600 hover:bg-gray-200 text-sm font-semibold px-4 py-1.5 rounded-full">...</button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-1 text-sm font-medium text-gray-700">
             <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-600"><span className="text-gray-400">›</span> Shared spaces</div>
             <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-600"><span className="text-gray-400">›</span> Starred</div>
             <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-600"><span className="text-gray-400">›</span> Chats</div>
             <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-600"><span className="text-gray-400">›</span> Channels</div>
             <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-600"><span className="text-gray-400">›</span> Meeting chats</div>
             <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-600"><span className="text-gray-400">›</span> Apps</div>
          </div>
        </div>

        {/* Detail Pane */}
        <div className="flex-1 bg-white flex flex-col items-center justify-center p-8">
           <p className="text-gray-500 text-[15px]">Start chatting by clicking or creating a chat in the left sidebar.</p>
        </div>
      </div>
    </AppShell>
  );
}
