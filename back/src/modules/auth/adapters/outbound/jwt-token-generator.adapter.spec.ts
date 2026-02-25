import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { AUTH_MODULE_TOKENS } from "../../constants/auth.tokens.constants";
import { JwtTokenGeneratorAdapter } from "./jwt-token-generator.adapter";

const mockJwtService = {
    signAsync: jest.fn(),
};

describe("JwtTokenGeneratorAdapter", () => {
    let adapter: JwtTokenGeneratorAdapter;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtTokenGeneratorAdapter,
                {
                    provide: AUTH_MODULE_TOKENS.JWT_SERVICE,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        adapter = module.get(JwtTokenGeneratorAdapter);
    });

    it("should call JwtService.signAsync with payload and return token", async () => {
        const payload = { sub: "user-uuid-1", email: "a@b.com" };
        mockJwtService.signAsync.mockResolvedValue("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");

        const result = await adapter.sign(payload);

        expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload);
        expect(result).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
    });
});
