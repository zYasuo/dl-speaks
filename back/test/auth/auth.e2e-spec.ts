/// <reference types="jest" />
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AuthE2eModule } from "../helpers/auth-e2e.module";
import { GlobalHttpExceptionFilter } from "../../src/commons/filters/http-exception.filter";

describe("Auth (e2e)", () => {
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

    describe("POST /api/v1/auth/signup", () => {
        it("should register a new user and return public user data", async () => {
            const payload = { email: `e2e-auth-signup-${runId}@example.com`, password: validPassword };
            const res = await request(app.getHttpServer())
                .post("/api/v1/auth/signup")
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

        it("should return 409 when signing up with the same email twice", async () => {
            const duplicateEmail = `e2e-auth-duplicate-${runId}@example.com`;
            await request(app.getHttpServer())
                .post("/api/v1/auth/signup")
                .send({ email: duplicateEmail, password: validPassword })
                .expect(201);

            const res = await request(app.getHttpServer())
                .post("/api/v1/auth/signup")
                .send({ email: duplicateEmail, password: validPassword })
                .expect(409);

            expect(res.body).toHaveProperty("message");
        });

        it("should return 400 for invalid email", async () => {
            const res = await request(app.getHttpServer())
                .post("/api/v1/auth/signup")
                .send({ email: "not-an-email", password: validPassword })
                .expect(400);

            expect(res.body).toHaveProperty("message", "Validation failed");
        });

        it("should return 400 for password shorter than 8 characters", async () => {
            const res = await request(app.getHttpServer())
                .post("/api/v1/auth/signup")
                .send({ email: "ok@example.com", password: "short" })
                .expect(400);

            expect(res.body).toHaveProperty("message", "Validation failed");
        });
    });

    describe("POST /api/v1/auth/signin", () => {
        const signinUser = { email: `e2e-auth-signin-${runId}@example.com`, password: validPassword };

        beforeAll(async () => {
            await request(app.getHttpServer()).post("/api/v1/auth/signup").send(signinUser);
        });

        it("should sign in and return user and access_token", async () => {
            const res = await request(app.getHttpServer())
                .post("/api/v1/auth/signin")
                .send(signinUser)
                .expect(200);

            expect(res.body).toMatchObject({ token_type: "Bearer" });
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("email", signinUser.email);
            expect(res.body).toHaveProperty("access_token");
            expect(typeof res.body.access_token).toBe("string");
        });

        it("should return 401 with wrong password", async () => {
            await request(app.getHttpServer())
                .post("/api/v1/auth/signin")
                .send({ email: signinUser.email, password: "wrongpassword" })
                .expect(401);
        });

        it("should return 401 for unregistered email", async () => {
            await request(app.getHttpServer())
                .post("/api/v1/auth/signin")
                .send({ email: `unknown-auth-${runId}@example.com`, password: validPassword })
                .expect(401);
        });
    });
});
