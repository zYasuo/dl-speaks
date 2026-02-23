export interface IPasswordHasher {
    hash(plain: string): Promise<string>;
}
