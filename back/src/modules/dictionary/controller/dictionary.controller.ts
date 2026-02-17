import { Controller, Get, Inject, Param } from "@nestjs/common";
import { DICTIONARY_MODULE_TOKENS } from "../constants/dictonary.tokens";
import type { IDictionaryService } from "../services/interfaces/dictionary-service.interface";

@Controller("dictionary")
export class DictionaryController {
    constructor(@Inject(DICTIONARY_MODULE_TOKENS.DICTIONARY_SERVICE) private readonly dictionary_service: IDictionaryService) {}

    @Get(":language/:word")
    async getWord(@Param("language") language: string, @Param("word") word: string) {
        return this.dictionary_service.getWord(language, word);
    }
}
