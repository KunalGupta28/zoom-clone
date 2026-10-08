import { Suspense } from "react";
import MeetingPageInner from "./MeetingPageInner";

export default function MeetingPage() {
  return (
    <Suspense fallback={
      <main className="h-screen w-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </main>
    }>
      <MeetingPageInner />
    </Suspense>
  );
}
