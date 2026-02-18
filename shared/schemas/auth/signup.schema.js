"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSignupResponse = exports.SSignup = void 0;
const zod_1 = require("zod");
const user_schema_1 = require("../user/user.schema");
exports.SSignup = zod_1.z.object({
    email: zod_1.z.email({ message: "Invalid email" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});
exports.SSignupResponse = zod_1.z.object({
    user: user_schema_1.SUserPublic,
});
//# sourceMappingURL=signup.schema.js.map