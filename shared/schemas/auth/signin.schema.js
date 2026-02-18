"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSigninResponse = exports.SSignin = void 0;
const zod_1 = require("zod");
const user_schema_1 = require("../user/user.schema");
exports.SSignin = zod_1.z.object({
    email: zod_1.z.email({ message: "Invalid email" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});
exports.SSigninResponse = zod_1.z.object({
    user: user_schema_1.SUserPublic,
    access_token: zod_1.z.string(),
    token_type: zod_1.z.enum(["Bearer"]),
});
//# sourceMappingURL=signin.schema.js.map