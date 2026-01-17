export interface UserData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    roles?: string[];
}

export interface RefreshPayload {
    refreshToken: string;
    email: string;
}
