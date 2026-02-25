/// <reference types="jest" />
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AuthE2eModule } from "../helpers/auth-e2e.module";
import { GlobalHttpExceptionFilter } from "../../src/commons/filters/http-exception.filter";

describe("User (e2e)", () => {
    let app: INestApplication;

    const validPassword = "password123";
    const runId = Date.now();

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthE2eModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("api/v1");
        app.useGlobalFilters(new GlobalHttpExceptionFilter());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe("POST /api/v1/users", () => {
        it("should create a user and return public user data", async () => {
            const payload = { email: `e2e-user-create-${runId}@example.com`, password: validPassword };
            const res = await request(app.getHttpServer())
                .post("/api/v1/users")
                .send(payload)
                .expect(201);

            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toMatchObject({
                email: payload.email,
                role: "USER",
            });
            expect(res.body.user).toHaveProperty("uuid");
            expect(res.body.user).toHaveProperty("created_at");
            expect(res.body.user).not.toHaveProperty("password");
        });

        it("should return 409 when creating user with same email twice", async () => {
            const duplicateEmail = `e2e-user-duplicate-${runId}@example.com`;
            await request(app.getHttpServer())
                .post("/api/v1/users")
                .send({ email: duplicateEmail, password: validPassword })
                .expect(201);

            const res = await request(app.getHttpServer())
                .post("/api/v1/users")
                .send({ email: duplicateEmail, password: validPassword })
                .expect(409);

            expect(res.body).toHaveProperty("message");
        });

        it("should return 400 for invalid email", async () => {
            const res = await request(app.getHttpServer())
                .post("/api/v1/users")
                .send({ email: "not-an-email", password: validPassword })
                .expect(400);

            expect(res.body).toHaveProperty("message", "Validation failed");
        });

        it("should return 400 for password shorter than 8 characters", async () => {
            const res = await request(app.getHttpServer())
                .post("/api/v1/users")
                .send({ email: "ok@example.com", password: "short" })
                .expect(400);

            expect(res.body).toHaveProperty("message", "Validation failed");
        });
    });
});
