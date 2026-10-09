"use client";

import { useAppStore } from "@/stores/app-store";
import { 
  TrackToggle, 
  DisconnectButton, 
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Mic, MicOff, Video, VideoOff, Users, MessageSquare, MonitorUp, MoreHorizontal, PhoneOff } from "lucide-react";
import { useParticipants } from "@livekit/components-react";
import { useState } from "react";

export default function ZoomToolbar() {
  const { activePanel, setActivePanel } = useAppStore();
  const participants = useParticipants();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <div className="h-20 bg-[#1A1A1A] border-t border-black flex items-center justify-between px-4 z-10 font-sans">
      
      {/* Left (Empty / Meeting Info on Mobile) */}
      <div className="w-1/4 hidden md:flex items-center text-gray-400 text-xs">
         {/* Could put security icon or encrypted status here */}
      </div>

      {/* Center Controls */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4 flex-1">
        
        <div className="flex flex-col items-center gap-1 group">
          <TrackToggle 
             source={Track.Source.Microphone} 
             className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-transparent hover:bg-gray-800 border-0 flex items-center justify-center text-gray-200 data-[state=false]:text-red-500 data-[state=false]:bg-gray-800 transition-colors" 
          >
             {/* LiveKit TrackToggle handles its own SVG by default, but we can style the wrapper */}
          </TrackToggle>
        </div>

        <div className="flex flex-col items-center gap-1 group">
          <TrackToggle 
             source={Track.Source.Camera} 
             className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-transparent hover:bg-gray-800 border-0 flex items-center justify-center text-gray-200 data-[state=false]:text-red-500 data-[state=false]:bg-gray-800 transition-colors" 
          >
          </TrackToggle>
        </div>

        <div className="w-px h-8 bg-gray-700 mx-1 sm:mx-2 hidden xs:block"></div>

        <button 
          onClick={() => setActivePanel(activePanel === "participants" ? "none" : "participants")}
          className={`flex flex-col items-center justify-center w-12 sm:w-16 h-10 sm:h-12 rounded-lg hover:bg-gray-800 transition-colors ${activePanel === "participants" ? "text-green-500" : "text-gray-300"}`}
        >
           <div className="relative">
             <Users className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
             <span className="absolute -top-1 -right-2 bg-gray-600 text-white text-[9px] font-bold px-1 rounded-full">
               {participants.length}
             </span>
           </div>
           <span className="text-[9px] sm:text-[10px] hidden sm:block">Participants</span>
        </button>

        <button 
          onClick={() => setActivePanel(activePanel === "chat" ? "none" : "chat")}
          className={`flex flex-col items-center justify-center w-12 sm:w-16 h-10 sm:h-12 rounded-lg hover:bg-gray-800 transition-colors ${activePanel === "chat" ? "text-green-500" : "text-gray-300"}`}
        >
           <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
           <span className="text-[9px] sm:text-[10px] hidden sm:block">Chat</span>
        </button>

        <TrackToggle 
             source={Track.Source.ScreenShare} 
             className="flex flex-col items-center justify-center w-12 sm:w-16 h-10 sm:h-12 rounded-lg bg-transparent hover:bg-gray-800 border-0 text-gray-300 data-[state=true]:text-green-500 transition-colors" 
             showIcon={false}
        >
             <MonitorUp className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
             <span className="text-[9px] sm:text-[10px] hidden sm:block">Share</span>
        </TrackToggle>

      </div>

      {/* Right Controls */}
      <div className="w-auto shrink-0 md:w-1/4 flex justify-end items-center gap-2 sm:gap-4 relative">
         <button 
           onClick={() => setIsMoreOpen(!isMoreOpen)}
           className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${isMoreOpen ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
         >
           <MoreHorizontal className="w-5 h-5 mb-1" />
           <span className="text-[10px]">More</span>
         </button>

         {/* More Options Dropdown */}
         {isMoreOpen && (
           <div className="absolute bottom-16 right-20 w-48 bg-[#1e1e1e] border border-gray-700/50 rounded-xl shadow-2xl py-2 z-50 text-sm font-medium">
             <button 
               className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors"
               onClick={() => {
                 alert("Recording started (Mock feature)");
                 setIsMoreOpen(false);
               }}
             >
               Record
             </button>
             <button 
               className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors"
               onClick={() => setIsMoreOpen(false)}
             >
               Reactions
             </button>
             <button 
               className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors"
               onClick={() => setIsMoreOpen(false)}
             >
               Background Effects
             </button>
             <div className="h-px bg-gray-700/50 my-1 mx-2"></div>
             <button 
               className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors flex items-center justify-between"
               onClick={() => setIsMoreOpen(false)}
             >
               Settings
             </button>
           </div>
         )}
         
         <DisconnectButton className="bg-[#DE2828] hover:bg-[#C72222] text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors border-0">
            Leave
         </DisconnectButton>
      </div>

    </div>
  );
}
