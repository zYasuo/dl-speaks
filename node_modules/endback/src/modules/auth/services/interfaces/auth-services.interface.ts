import { User } from "@prisma/client";

export interface SigninResult {
    user: User;
    access_token: string;
}

export interface IAuthService {
    signin(email: string, password: string): Promise<SigninResult>;
    signup(email: string, password: string): Promise<User>;
}

