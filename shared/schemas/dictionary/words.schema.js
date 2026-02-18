"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SWords = exports.SWordEntry = exports.SMeaning = exports.SDefinition = exports.SPhonetic = void 0;
const zod_1 = require("zod");
exports.SPhonetic = zod_1.z.object({
    text: zod_1.z.string().optional(),
    audio: zod_1.z.string().optional(),
});
exports.SDefinition = zod_1.z.object({
    definition: zod_1.z.string(),
    example: zod_1.z.string().optional(),
    synonyms: zod_1.z.array(zod_1.z.string()).optional(),
    antonyms: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.SMeaning = zod_1.z.object({
    partOfSpeech: zod_1.z.string(),
    definitions: zod_1.z.array(exports.SDefinition),
});
exports.SWordEntry = zod_1.z.object({
    word: zod_1.z.string(),
    phonetic: zod_1.z.string().optional(),
    phonetics: zod_1.z.array(exports.SPhonetic).optional(),
    origin: zod_1.z.string().optional(),
    meanings: zod_1.z.array(exports.SMeaning),
});
exports.SWords = zod_1.z.union([exports.SWordEntry, zod_1.z.array(exports.SWordEntry)]);
//# sourceMappingURL=words.schema.js.map