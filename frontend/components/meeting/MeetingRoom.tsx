"use client";

import { Meeting } from "@/types/meeting";
import { 
  ParticipantTile, 
  useTracks, 
  RoomAudioRenderer,
  GridLayout,
  TrackLoop,
  useParticipants
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useAppStore } from "@/stores/app-store";
import { ShieldCheck } from "lucide-react";
import ZoomToolbar from "./ZoomToolbar";
import ParticipantsPanel from "./ParticipantsPanel";
import CustomChat from "./CustomChat";
import { useHostControls } from "./useHostControls";

export default function MeetingRoom({ meeting }: { meeting: Meeting }) {
  const { activePanel, setActivePanel } = useAppStore();
  const participants = useParticipants();
  
  // Mount the host controls listener
  useHostControls(meeting.meeting_code);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: false },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-[#050505] text-white overflow-hidden font-sans">
      
      {/* Header */}
      <header className="h-12 flex items-center justify-between px-6 z-10 absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="bg-green-500/20 p-1.5 rounded-md">
             <ShieldCheck className="w-4 h-4 text-green-500" />
           </div>
           <span className="font-semibold text-[15px] tracking-wide">{meeting.title}</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/80 rounded-lg text-xs font-medium border border-gray-700/50 shadow-inner">
             <span className="text-gray-400">ID:</span>
             <span className="text-gray-200 tracking-wider font-mono">{meeting.meeting_code}</span>
           </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative pt-12">
        
        {/* Video Grid */}
        <div className={`flex-1 p-4 md:p-8 relative h-full transition-all duration-300 ease-in-out ${activePanel !== 'none' ? 'mr-80' : ''}`}>
           <GridLayout tracks={tracks} style={{ height: '100%', width: '100%' }}>
              <ParticipantTile className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 bg-[#1e1e1e] transition-all hover:border-gray-500/50 ring-1 ring-black/50" />
           </GridLayout>
        </div>

        {/* Side Panels */}
        <div className={activePanel === "participants" ? "block" : "hidden"}>
           <ParticipantsPanel />
        </div>
        
        <div className={`absolute right-0 top-0 bottom-0 w-80 border-l border-gray-800/80 bg-[#1a1a1a] flex flex-col h-full shadow-2xl z-10 transform transition-transform duration-300 ${activePanel === "chat" ? "translate-x-0" : "translate-x-full hidden"}`}>
          <div className="p-4 border-b border-gray-800/80 flex justify-between items-center bg-[#1e1e1e] shrink-0">
            <h2 className="font-semibold text-white tracking-wide">In-Meeting Chat</h2>
            <button onClick={() => setActivePanel("none")} className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">✕</button>
          </div>
          <div className="flex-1 overflow-hidden relative">
             <CustomChat />
          </div>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <ZoomToolbar meetingCode={meeting.meeting_code} />
      
      <RoomAudioRenderer />
    </div>
  );
}
