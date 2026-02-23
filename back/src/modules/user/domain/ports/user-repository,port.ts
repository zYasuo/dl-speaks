import { TSignup } from "@shared/schemas/auth/signup.schema";
import { TUserUpdate } from "@shared/schemas/user/user.schema";
import { UserEntity } from "../entities/user.entity";

export interface IUserRepository {
    createUser(user: TSignup): Promise<UserEntity>;
    // deleteUser(uuid: string): Promise<void>;
    // updateUser(uuid: string, data: TUserUpdate): Promise<UserEntity>;
    // getUserByEmail(email: string): Promise<UserEntity>;
    // getUserByUuid(uuid: string): Promise<UserEntity>;
    // isUserExists(email: string): Promise<boolean>;
    // profile(uuid: string): Promise<UserEntity>;
}
