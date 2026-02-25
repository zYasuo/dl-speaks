import { Controller, Get, Inject, Param } from "@nestjs/common";
import type { GetWordUseCase } from "../../domain/use-cases/get-word.use-case";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";

@Controller("dictionary")
export class DictionaryController {
    constructor(
        @Inject(DICTIONARY_MODULE_TOKENS.GET_WORD_USE_CASE)
        private readonly getWordUseCase: GetWordUseCase
    ) {}

    @Get(":language/:word")
    async getWord(@Param("language") language: string, @Param("word") word: string) {
        return this.getWordUseCase.execute(language, word);
    }
}
