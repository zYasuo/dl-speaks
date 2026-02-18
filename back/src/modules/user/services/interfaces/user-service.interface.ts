import { User } from "@prisma/client";
import type { TSignup } from "@shared/schemas/auth/signup.schema";
import type { TUser, TUserUpdate } from "@shared/schemas/user/user.schema";

export interface IUserService {
    createUser(user: TSignup): Promise<User>;
    deleteUser(uuid: string): Promise<void>;
    updateUser(uuid: string, data: TUserUpdate): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getUserByUuid(uuid: string): Promise<User>;
    isUserExists(email: string): Promise<boolean>;
    profile(uuid: string): Promise<TUser>;
}
