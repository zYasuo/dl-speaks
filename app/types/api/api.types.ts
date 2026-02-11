export interface IActionResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
}
