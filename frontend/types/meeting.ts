export interface Meeting {
    id: number;
    meeting_code: string;
    title: string;
    description?: string;
    host_user_id: number;
    scheduled_at?: string;
    duration_minutes: number;
    status: string;
    created_at: string;
    started_at?: string;
    ended_at?: string;
}
