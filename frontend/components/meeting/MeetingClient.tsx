"use client";

import { useState, useEffect } from "react";
import { Meeting } from "@/types/meeting";
import { getMeeting, getLiveKitToken } from "@/lib/api";
import { useUserStore } from "@/stores/user-store";
import { PreJoin, LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import MeetingRoom from "./MeetingRoom";

export default function MeetingClient({ meetingCode }: { meetingCode: string }) {
  const { user } = useUserStore();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [preJoinComplete, setPreJoinComplete] = useState(false);
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMeeting() {
      try {
        const data = await getMeeting(meetingCode);
        if (!data) {
          setNotFound(true);
        } else {
          setMeeting(data);
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadMeeting();
  }, [meetingCode]);

  const handlePreJoinSubmit = async (values: {
    username: string;
    videoEnabled: boolean;
    audioEnabled: boolean;
  }) => {
    try {
      const response = await getLiveKitToken(meetingCode, values.username);
      setToken(response.token);
      setServerUrl(response.server_url);
      setPreJoinComplete(true);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the meeting. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-meeting-bg)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-zoom-primary)]"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-meeting-bg)] text-white p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Meeting not found</h1>
          <p className="text-gray-400 mb-6">The meeting ID you entered is invalid or the meeting has ended.</p>
          <a href="/" className="bg-[var(--color-zoom-primary)] hover:bg-[var(--color-zoom-primary-hover)] px-4 py-2 rounded-md font-medium transition-colors">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-meeting-bg)] text-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => { setError(""); }} className="bg-[var(--color-zoom-primary)] px-4 py-2 rounded-md">Retry</button>
        </div>
      </div>
    );
  }

  if (!preJoinComplete || !meeting) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-dashboard-bg)]" data-lk-theme="default">
        <div className="bg-[var(--color-surface)] p-8 rounded-xl border border-[var(--color-border)]">
          <PreJoin
            defaults={{
              username: user?.name || "Guest",
              videoEnabled: true,
              audioEnabled: true,
            }}
            onSubmit={handlePreJoinSubmit}
            onValidate={(val) => {
              return !!val.username && val.username.length > 0;
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={serverUrl}
      data-lk-theme="default"
      className="h-full w-full"
      onDisconnected={() => {
        window.location.href = "/";
      }}
    >
      <MeetingRoom meeting={meeting} />
    </LiveKitRoom>
  );
}
