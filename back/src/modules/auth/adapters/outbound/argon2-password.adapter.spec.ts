import { Test, TestingModule } from "@nestjs/testing";
import { Argon2PasswordAdapter } from "./argon2-password.adapter";

describe("Argon2PasswordAdapter", () => {
    let adapter: Argon2PasswordAdapter;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Argon2PasswordAdapter],
        }).compile();

        adapter = module.get(Argon2PasswordAdapter);
    });

    describe("hash", () => {
        it("should return a hash different from plain text", async () => {
            const plain = "mySecretPassword123";
            const hash = await adapter.hash(plain);
            expect(hash).not.toBe(plain);
            expect(hash.length).toBeGreaterThan(0);
        });

        it("should produce different hashes for same input (salt)", async () => {
            const plain = "same";
            const h1 = await adapter.hash(plain);
            const h2 = await adapter.hash(plain);
            expect(h1).not.toBe(h2);
        });
    });

    describe("verify", () => {
        it("should return true when plain matches hash", async () => {
            const plain = "password123";
            const hash = await adapter.hash(plain);
            const result = await adapter.verify(plain, hash);
            expect(result).toBe(true);
        });

        it("should return false when plain does not match hash", async () => {
            const hash = await adapter.hash("correct");
            const result = await adapter.verify("wrong", hash);
            expect(result).toBe(false);
        });
    });
});
