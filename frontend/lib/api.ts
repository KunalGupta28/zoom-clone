const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getHeaders() {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
}

export async function fetchUpcomingMeetings() {
    const res = await fetch(`${API_BASE_URL}/meetings/upcoming`, { 
        headers: getHeaders(),
        cache: 'no-store' 
    });
    if (!res.ok) throw new Error("Failed to fetch upcoming meetings");
    return res.json();
}

export async function fetchRecentMeetings() {
    const res = await fetch(`${API_BASE_URL}/meetings/recent`, { 
        headers: getHeaders(),
        cache: 'no-store' 
    });
    if (!res.ok) throw new Error("Failed to fetch recent meetings");
    return res.json();
}

export async function createMeeting(data: { title: string, duration_minutes: number, type: "instant" | "scheduled", scheduled_at?: string, description?: string }) {
    const res = await fetch(`${API_BASE_URL}/meetings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create meeting");
    return res.json();
}

export async function getMeeting(meetingCode: string) {
    const res = await fetch(`${API_BASE_URL}/meetings/${meetingCode}`, { 
        headers: getHeaders(),
        cache: 'no-store' 
    });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch meeting");
    }
    return res.json();
}

export async function getLiveKitToken(meetingCode: string, displayName: string) {
    const res = await fetch(`${API_BASE_URL}/meetings/${meetingCode}/token`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ display_name: displayName }),
    });
    if (!res.ok) throw new Error("Failed to fetch token");
    return res.json();
}

export async function deleteMeeting(meetingCode: string) {
    const res = await fetch(`${API_BASE_URL}/meetings/${meetingCode}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete meeting");
    return true;
}

export async function updateMeeting(meetingCode: string, data: { title?: string, description?: string }) {
    const res = await fetch(`${API_BASE_URL}/meetings/${meetingCode}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update meeting");
    return res.json();
}

// --- Auth Endpoints ---

export async function login(data: any) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
}

export async function signup(data: any) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Signup failed");
    }
    return res.json();
}

export async function getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(),
        cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
}

export async function forgotPassword(email: string) {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Request failed");
    }
    return res.json();
}

export async function resetPassword(token: string, new_password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Request failed");
    }
    return res.json();
}

export async function verifyEmail(token: string) {
    const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Verification failed");
    }
    return res.json();
}
