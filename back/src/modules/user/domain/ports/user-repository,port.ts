import { TSignup } from "@shared/schemas/auth/signup.schema";
import { TUserUpdate } from "@shared/schemas/user/user.schema";
import { UserEntity } from "../entities/user.entity";

export interface IUserRepository {
    createUser(user: TSignup): Promise<UserEntity>;
    getUserByEmail(email: string): Promise<UserEntity | null>;
    isUserExists(email: string): Promise<boolean>;
    // deleteUser(uuid: string): Promise<void>;
    // updateUser(uuid: string, data: TUserUpdate): Promise<UserEntity>;
    // getUserByUuid(uuid: string): Promise<UserEntity>;
    // profile(uuid: string): Promise<TUser>;
}
