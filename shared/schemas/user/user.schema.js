"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUserUpdate = exports.SUserPublic = exports.SUser = void 0;
const zod_1 = require("zod");
exports.SUser = zod_1.z.object({
    uuid: zod_1.z.uuid(),
    role: zod_1.z.enum(["USER", "ADMIN"]),
    email: zod_1.z.email(),
    created_at: zod_1.z.date(),
    updated_at: zod_1.z.date(),
});
exports.SUserPublic = exports.SUser.pick({
    uuid: true,
    email: true,
    role: true,
    created_at: true,
});
exports.SUserUpdate = zod_1.z.object({
    email: zod_1.z.email().optional(),
    role: zod_1.z.enum(["USER", "ADMIN"]).optional(),
});
//# sourceMappingURL=user.schema.js.map