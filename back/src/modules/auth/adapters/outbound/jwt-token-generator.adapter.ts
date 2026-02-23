import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AUTH_MODULE_TOKENS } from "../../constants/auth.tokens.constants";
import type { ITokenGenerator } from "../../domain/ports/token-generator.port";

@Injectable()
export class JwtTokenGeneratorAdapter implements ITokenGenerator {
    constructor(
        @Inject(AUTH_MODULE_TOKENS.JWT_SERVICE)
        private readonly jwtService: JwtService
    ) {}

    async sign(payload: { sub: string; email: string }): Promise<string> {
        return this.jwtService.signAsync(payload);
    }
}
