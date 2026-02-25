import { Test, TestingModule } from "@nestjs/testing";
import { USER_MODULE_TOKENS } from "src/modules/user/constants/user.tokens.constants";
import { AUTH_MODULE_TOKENS } from "../../constants/auth.tokens.constants";
import { SigninUseCase } from "./signin.use-case";
import { InvalidCredentialsError } from "src/commons/domain/exceptions/auth.exceptions";

const mockUserRepository = {
    getUserByEmail: jest.fn(),
};

const mockPasswordVerifier = {
    verify: jest.fn(),
};

const mockTokenGenerator = {
    sign: jest.fn(),
};

describe("SigninUseCase", () => {
    let useCase: SigninUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: SigninUseCase,
                    useFactory: (userRepository, passwordVerifier, tokenGenerator) =>
                        new SigninUseCase(userRepository, passwordVerifier, tokenGenerator),
                    inject: [
                        USER_MODULE_TOKENS.USER_REPOSITORY,
                        AUTH_MODULE_TOKENS.PASSWORD_VERIFIER,
                        AUTH_MODULE_TOKENS.TOKEN_GENERATOR,
                    ],
                },
                {
                    provide: USER_MODULE_TOKENS.USER_REPOSITORY,
                    useValue: mockUserRepository,
                },
                {
                    provide: AUTH_MODULE_TOKENS.PASSWORD_VERIFIER,
                    useValue: mockPasswordVerifier,
                },
                {
                    provide: AUTH_MODULE_TOKENS.TOKEN_GENERATOR,
                    useValue: mockTokenGenerator,
                },
            ],
        }).compile();

        useCase = module.get(SigninUseCase);
    });

    it("should return user and access_token when credentials are valid", async () => {
        const user = {
            uuid: "u1",
            email: "a@b.com",
            password: "hashed",
            role: "USER",
            createdAt: new Date("2024-01-01"),
        };
        mockUserRepository.getUserByEmail.mockResolvedValue(user);
        mockPasswordVerifier.verify.mockResolvedValue(true);
        mockTokenGenerator.sign.mockResolvedValue("jwt-token");

        const result = await useCase.execute("a@b.com", "plain");

        expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith("a@b.com");
        expect(mockPasswordVerifier.verify).toHaveBeenCalledWith("plain", "hashed");
        expect(mockTokenGenerator.sign).toHaveBeenCalledWith({
            sub: "u1",
            email: "a@b.com",
        });
        expect(result).toEqual({
            user: {
                uuid: "u1",
                email: "a@b.com",
                role: "USER",
                created_at: user.createdAt,
            },
            access_token: "jwt-token",
        });
    });

    it("should throw InvalidCredentialsError when user not found", async () => {
        mockUserRepository.getUserByEmail.mockResolvedValue(null);

        await expect(useCase.execute("a@b.com", "pass")).rejects.toThrow(InvalidCredentialsError);
        await expect(useCase.execute("a@b.com", "pass")).rejects.toThrow("Invalid credentials");
        expect(mockPasswordVerifier.verify).not.toHaveBeenCalled();
        expect(mockTokenGenerator.sign).not.toHaveBeenCalled();
    });

    it("should throw InvalidCredentialsError when password is invalid", async () => {
        const user = {
            uuid: "u1",
            email: "a@b.com",
            password: "hashed",
            role: "USER",
            createdAt: new Date(),
        };
        mockUserRepository.getUserByEmail.mockResolvedValue(user);
        mockPasswordVerifier.verify.mockResolvedValue(false);

        await expect(useCase.execute("a@b.com", "wrong")).rejects.toThrow(InvalidCredentialsError);
        await expect(useCase.execute("a@b.com", "wrong")).rejects.toThrow("Invalid credentials");
        expect(mockTokenGenerator.sign).not.toHaveBeenCalled();
    });
});
