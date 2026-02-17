import { IUser } from "../user/user.types";

export type TAuthProfile = IUser;

export interface IAuthSignin {
    user: IUser;
    access_token?: string;
    token_type?: "Bearer";
}

