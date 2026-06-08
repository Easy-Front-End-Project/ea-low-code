export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data: T;
}
export interface PaginationParams {
    page?: number;
    pageSize?: number;
}
export interface PaginatedData<T = unknown> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}
export type PaginatedResponse<T = unknown> = ApiResponse<PaginatedData<T>>;
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponseData {
    accessToken: string;
    user: {
        id: number;
        email: string;
        username: string;
    };
}
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}
export interface UserInfo {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
