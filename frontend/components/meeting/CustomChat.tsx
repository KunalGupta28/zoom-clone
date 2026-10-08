"use client";

import { useChat, useLocalParticipant } from "@livekit/components-react";
import { useState } from "react";
import { Send } from "lucide-react";

export default function CustomChat() {
  const { send, chatMessages } = useChat();
  const { localParticipant } = useLocalParticipant();
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      send(message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1a1a1a] text-gray-200 font-sans">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {chatMessages.length === 0 ? (
           <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
             No messages yet. Start the conversation!
           </div>
        ) : (
          chatMessages.map((msg, idx) => {
            const isLocal = msg.from?.identity === localParticipant.identity;
            return (
              <div key={idx} className={`flex flex-col ${isLocal ? "items-end" : "items-start"}`}>
                <span className="text-[11px] text-gray-400 mb-1 px-1">
                  {msg.from?.name || "Guest"} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div 
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                    isLocal 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800 bg-[#1e1e1e]">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-500"
          />
          <button 
            type="submit" 
            disabled={!message.trim()}
            className="absolute right-2 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-full transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
