"use client";

import { useEffect, useCallback } from "react";
import { useRoomContext, useLocalParticipant } from "@livekit/components-react";

import { endMeetingApi } from "@/lib/api";

export function useHostControls(meetingCode?: string) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const handleData = useCallback((payload: Uint8Array, participant?: any) => {
    try {
      const str = new TextDecoder().decode(payload);
      const data = JSON.parse(str);
      
      if (data.action === "mute_all") {
        let isLocalHost = false;
        try {
           if (localParticipant.metadata) {
              const meta = JSON.parse(localParticipant.metadata);
              isLocalHost = meta.is_host === true;
           }
        } catch(e){}
        if (isLocalHost) return; // Host doesn't mute themselves
        localParticipant.setMicrophoneEnabled(false);
      }

      if (data.action === "mute" && data.identity === localParticipant.identity) {
        localParticipant.setMicrophoneEnabled(false);
      }

      if (data.action === "disable_camera" && data.identity === localParticipant.identity) {
        localParticipant.setCameraEnabled(false);
      }
      
      if (data.action === "kick" && data.identity === localParticipant.identity) {
        room.disconnect();
      }

      if (data.action === "end_meeting") {
        room.disconnect();
        window.location.href = "/";
      }
    } catch (e) {
      console.error("Failed to parse host control message", e);
    }
  }, [localParticipant, room]);

  useEffect(() => {
    room.on("dataReceived", handleData);
    return () => {
      room.off("dataReceived", handleData);
    };
  }, [room, handleData]);

  let isHost = false;
  try {
     if (localParticipant.metadata) {
        const meta = JSON.parse(localParticipant.metadata);
        isHost = meta.is_host === true;
     }
  } catch(e){}

  const sendCommand = (cmd: any) => {
    if (!isHost) return;
    
    const str = JSON.stringify(cmd);
    const data = new TextEncoder().encode(str);
    room.localParticipant.publishData(data, { reliable: true });
  };

  const muteAll = () => {
    sendCommand({ action: "mute_all" });
  };

  const muteParticipant = (identity: string) => {
    sendCommand({ action: "mute", identity });
  };

  const disableCamera = (identity: string) => {
    sendCommand({ action: "disable_camera", identity });
  };

  const kickParticipant = (identity: string) => {
    sendCommand({ action: "kick", identity });
  };

  const endMeeting = async () => {
    if (meetingCode) {
        try {
            await endMeetingApi(meetingCode);
        } catch (e) {
            console.error("Failed to end meeting on backend", e);
        }
    }
    sendCommand({ action: "end_meeting" });
    room.disconnect();
    window.location.href = "/";
  };

  return {
    isHost,
    muteAll,
    muteParticipant,
    disableCamera,
    kickParticipant,
    endMeeting
  };
}
