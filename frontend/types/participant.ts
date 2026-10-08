export interface Participant {
    id: number;
    meeting_id: number;
    user_id?: number;
    display_name: string;
    role: string;
    joined_at: string;
    left_at?: string;
}
