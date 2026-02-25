import { Test, TestingModule } from "@nestjs/testing";
import { USER_MODULE_TOKENS } from "../../constants/user.tokens.constants";
import { CreateUserUseCase } from "./create-user.use.case";

const mockUserRepository = {
    createUser: jest.fn(),
};

describe("CreateUserUseCase", () => {
    let useCase: CreateUserUseCase;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: CreateUserUseCase,
                    useFactory: (userRepository) => new CreateUserUseCase(userRepository),
                    inject: [USER_MODULE_TOKENS.USER_REPOSITORY],
                },
                {
                    provide: USER_MODULE_TOKENS.USER_REPOSITORY,
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        useCase = module.get(CreateUserUseCase);
    });

    it("should delegate to userRepository.createUser and return result", async () => {
        const input = { email: "a@b.com", password: "hashed" };
        const created = {
            id: 1,
            uuid: "u1",
            email: "a@b.com",
            role: "USER",
            createdAt: new Date(),
        };
        mockUserRepository.createUser.mockResolvedValue(created);

        const result = await useCase.execute(input);

        expect(mockUserRepository.createUser).toHaveBeenCalledWith(input);
        expect(result).toEqual(created);
    });
});
