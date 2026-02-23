import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import type { IPasswordHasher } from "../../domain/ports/password-hasher.port";
import type { IPasswordVerifier } from "../../domain/ports/password-verifier.port";

@Injectable()
export class Argon2PasswordAdapter implements IPasswordHasher, IPasswordVerifier {
    async hash(plain: string): Promise<string> {
        return argon2.hash(plain);
    }

    async verify(plain: string, hash: string): Promise<boolean> {
        return argon2.verify(hash, plain);
    }
}
