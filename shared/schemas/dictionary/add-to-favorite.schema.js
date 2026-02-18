"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAddToFavorite = void 0;
const zod_1 = require("zod");
exports.SAddToFavorite = zod_1.z.object({
    wordId: zod_1.z.number().min(1, { message: "Word ID is required" }),
});
//# sourceMappingURL=add-to-favorite.schema.js.map