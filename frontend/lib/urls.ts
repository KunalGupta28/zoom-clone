export function getMeetingUrl(meetingCode: string): string {
    if (typeof window !== "undefined") {
        return `${window.location.origin}/meeting/${meetingCode}`;
    }
    // Fallback for SSR
    return `/meeting/${meetingCode}`;
}
