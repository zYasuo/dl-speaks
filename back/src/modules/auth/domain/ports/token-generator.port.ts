export interface ITokenGenerator {
    sign(payload: { sub: string; email: string }): Promise<string>;
}
