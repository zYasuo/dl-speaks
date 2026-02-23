import { Controller, Get, Param } from "@nestjs/common";
import { GetWordUseCase } from "../../domain/use-cases/get-word.use-case";

@Controller("dictionary")
export class DictionaryController {
    constructor(private readonly getWordUseCase: GetWordUseCase) {}

    @Get(":language/:word")
    async getWord(@Param("language") language: string, @Param("word") word: string) {
        return this.getWordUseCase.execute(language, word);
    }
}
