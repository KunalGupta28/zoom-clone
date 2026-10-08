"use client";

import AppShell from "@/components/shell/AppShell";
import { Search } from "lucide-react";

export default function ContactsPage() {
  return (
    <AppShell>
      <div className="flex h-full w-full bg-white text-gray-900">
        
        {/* Secondary Pane */}
        <div className="w-[360px] border-r border-[var(--color-border)] flex flex-col h-full bg-white shrink-0">
          <div className="p-4 border-b border-[var(--color-border)]">
             <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search" 
                 className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:bg-white transition-all"
               />
             </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4">
             <div className="w-8 h-8 border-2 border-[#0B5CFF] border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-gray-500 text-sm">Loading</p>
          </div>
        </div>

        {/* Detail Pane */}
        <div className="flex-1 bg-[#FAFAFA] flex flex-col items-center justify-center p-8">
           <div className="w-24 h-32 bg-gray-100 rounded-xl mb-6 shadow-sm border border-gray-200 flex items-center justify-center">
             <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center opacity-50">
               <div className="w-6 h-6 bg-gray-100 rounded-t-xl mt-4"></div>
             </div>
           </div>
           <p className="text-gray-500 text-[15px]">View Contact info by clicking a contact in the left panel</p>
        </div>
      </div>
    </AppShell>
  );
}
