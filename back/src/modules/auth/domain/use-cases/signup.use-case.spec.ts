import { Test, TestingModule } from "@nestjs/testing";
import { USER_MODULE_TOKENS } from "src/modules/user/constants/user.tokens.constants";
import { AUTH_MODULE_TOKENS } from "../../constants/auth.tokens.constants";
import { SignupUseCase } from "./signup.use-case";
import { UserAlreadyExistsError } from "src/commons/domain/exceptions/user.exceptions";

const mockUserRepository = {
    isUserExists: jest.fn(),
};

const mockPasswordHasher = {
    hash: jest.fn(),
};

const mockCreateUserUseCase = {
    execute: jest.fn(),
};

describe("SignupUseCase", () => {
    let useCase: SignupUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: SignupUseCase,
                    useFactory: (userRepository, passwordHasher, createUserUseCase) =>
                        new SignupUseCase(userRepository, passwordHasher, createUserUseCase),
                    inject: [
                        USER_MODULE_TOKENS.USER_REPOSITORY,
                        AUTH_MODULE_TOKENS.PASSWORD_HASHER,
                        USER_MODULE_TOKENS.CREATE_USER_USE_CASE,
                    ],
                },
                {
                    provide: USER_MODULE_TOKENS.USER_REPOSITORY,
                    useValue: mockUserRepository,
                },
                {
                    provide: AUTH_MODULE_TOKENS.PASSWORD_HASHER,
                    useValue: mockPasswordHasher,
                },
                {
                    provide: USER_MODULE_TOKENS.CREATE_USER_USE_CASE,
                    useValue: mockCreateUserUseCase,
                },
            ],
        }).compile();

        useCase = module.get(SignupUseCase);
    });

    it("should create user with hashed password when email does not exist", async () => {
        mockUserRepository.isUserExists.mockResolvedValue(false);
        mockPasswordHasher.hash.mockResolvedValue("hashed");
        const created = { uuid: "u1", email: "a@b.com", role: "USER", createdAt: new Date() };
        mockCreateUserUseCase.execute.mockResolvedValue(created);

        const result = await useCase.execute("a@b.com", "plain");

        expect(mockUserRepository.isUserExists).toHaveBeenCalledWith("a@b.com");
        expect(mockPasswordHasher.hash).toHaveBeenCalledWith("plain");
        expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith({
            email: "a@b.com",
            password: "hashed",
        });
        expect(result).toEqual(created);
    });

    it("should throw UserAlreadyExistsError when user already exists", async () => {
        mockUserRepository.isUserExists.mockResolvedValue(true);

        await expect(useCase.execute("a@b.com", "pass")).rejects.toThrow(UserAlreadyExistsError);
        await expect(useCase.execute("a@b.com", "pass")).rejects.toThrow("User already exists");
        expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
        expect(mockCreateUserUseCase.execute).not.toHaveBeenCalled();
    });
});
