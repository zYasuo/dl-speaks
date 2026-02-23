export interface IUserEntity {
    id: number;
    uuid: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    createdAt: Date;
    updatedAt: Date;
}

export class UserEntity implements IUserEntity {
    id: number;
    uuid: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    createdAt: Date;
    updatedAt: Date;

    constructor(user: IUserEntity) {
        this.id = user.id;
        this.uuid = user.uuid;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    static fromPrisma(prismaUser: {
        id: number;
        uuid: string;
        email: string;
        password: string;
        role: string;
        created_at: Date;
        updated_at: Date;
    }): UserEntity {
        return new UserEntity({
            id: prismaUser.id,
            uuid: prismaUser.uuid,
            email: prismaUser.email,
            password: prismaUser.password,
            role: prismaUser.role as "USER" | "ADMIN",
            createdAt: prismaUser.created_at,
            updatedAt: prismaUser.updated_at
        });
    }
}
