import { TSignup } from "@shared/schemas/auth/signup.schema";
import { UserEntity } from "../entities/user.entity";

export interface IUserRepository {
    createUser(user: TSignup): Promise<UserEntity>;
    getUserByEmail(email: string): Promise<UserEntity | null>;
    getUserByUuid(uuid: string): Promise<UserEntity | null>;
    isUserExists(email: string): Promise<boolean>;
}
