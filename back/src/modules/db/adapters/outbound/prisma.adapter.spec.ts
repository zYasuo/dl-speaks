import { Test, TestingModule } from "@nestjs/testing";
import { PrismaAdapter } from "./prisma.adapter";

describe("PrismaAdapter", () => {
    let adapter: PrismaAdapter;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrismaAdapter],
        }).compile();

        adapter = module.get(PrismaAdapter);
    });

    it("getClient should return client with $connect and $disconnect", () => {
        const client = adapter.getClient();
        expect(client).toBeDefined();
        expect(typeof client.$connect).toBe("function");
        expect(typeof client.$disconnect).toBe("function");
    });

    it("getClient should return same instance on multiple calls", () => {
        expect(adapter.getClient()).toBe(adapter.getClient());
    });

    it("onModuleInit should call $connect", async () => {
        const client = adapter.getClient();
        const connectSpy = jest.spyOn(client, "$connect").mockResolvedValue(undefined);
        await adapter.onModuleInit();
        expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it("onModuleDestroy should call $disconnect", async () => {
        const client = adapter.getClient();
        const disconnectSpy = jest.spyOn(client, "$disconnect").mockResolvedValue(undefined);
        await adapter.onModuleDestroy();
        expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
});
