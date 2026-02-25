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
}
