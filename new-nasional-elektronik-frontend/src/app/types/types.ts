
export interface LoginData {
    jwt_token: string;
}

export interface RegisterData {

}

export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}