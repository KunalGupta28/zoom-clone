"use client";

import { useParticipants, useLocalParticipant } from "@livekit/components-react";
import { Mic, MicOff, MoreHorizontal, User, ShieldAlert } from "lucide-react";
import { useHostControls } from "./useHostControls";
import { useState } from "react";
import { useAppStore } from "@/stores/app-store";

export default function ParticipantsPanel() {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const { isHost, muteAll, muteParticipant, disableCamera, kickParticipant } = useHostControls();
  const { setActivePanel } = useAppStore();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Helper to determine host
  const isParticipantHost = (name: string | undefined) => {
    if (!name) return false;
    const lower = name.toLowerCase();
    return lower.includes("kunal") || lower.includes("browser") || lower.includes("host");
  };

  // Put host first, then local, then others
  const sortedParticipants = [...participants].sort((a, b) => {
    if (isParticipantHost(a.name)) return -1;
    if (isParticipantHost(b.name)) return 1;
    if (a.identity === localParticipant.identity) return -1;
    if (b.identity === localParticipant.identity) return 1;
    return 0;
  });

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 border-l border-gray-800 bg-[#1e1e1e] flex flex-col h-full shadow-xl z-10 text-white font-sans">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="font-semibold text-white">Participants ({participants.length})</h2>
        <button onClick={() => setActivePanel("none")} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedParticipants.map((p) => {
          const isLocal = p.identity === localParticipant.identity;
          const isRoomHost = isParticipantHost(p.name);
          const isMicOn = p.isMicrophoneEnabled;
          
          return (
            <div key={p.identity} className="flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 group relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold uppercase">
                   {p.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-200">
                    {p.name || "Guest"} {isLocal && "(You)"}
                  </span>
                  {isRoomHost && <span className="text-[10px] text-gray-400">Host</span>}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isMicOn ? (
                  <Mic className="w-4 h-4 text-gray-400" />
                ) : (
                  <MicOff className="w-4 h-4 text-red-500" />
                )}
                
                {isHost && !isLocal && (
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === p.identity ? null : p.identity)}
                    className="p-1 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Host Action Menu */}
              {openMenuId === p.identity && isHost && !isLocal && (
                <div className="absolute right-4 top-10 w-32 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-20">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-gray-200"
                    onClick={() => {
                      muteParticipant(p.identity);
                      setOpenMenuId(null);
                    }}
                  >
                    Mute Audio
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-gray-200"
                    onClick={() => {
                      disableCamera(p.identity);
                      setOpenMenuId(null);
                    }}
                  >
                    Stop Video
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-900/50 text-red-400"
                    onClick={() => {
                      kickParticipant(p.identity);
                      setOpenMenuId(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {isHost && (
        <div className="p-4 border-t border-gray-800 flex justify-center">
          <button 
            onClick={muteAll}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium text-white transition-colors"
          >
            Mute All
          </button>
        </div>
      )}
    </div>
  );
}
