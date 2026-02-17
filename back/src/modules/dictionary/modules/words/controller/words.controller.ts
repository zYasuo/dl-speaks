import { Controller, Get, Inject, Post } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { DICTIONARY_MODULE_TOKENS } from "../../../constants/dictonary.tokens";
import type { IWordService } from "../services/interfaces/words-service.interface";
import { AddFavoriteDTO } from "./DTO/add-favorite.dto";
import { JwtGuard } from "src/modules/auth/jwt/guards/jwt-guard";
import { UseGuards, Req } from "@nestjs/common";

@Controller("words")
export class WordsController {
    constructor(@Inject(DICTIONARY_MODULE_TOKENS.WORDS_SERVICE) private readonly wordsService: IWordService) {}

    @Get("recent")
    async getRecentWords() {
        return this.wordsService.recentWords();
    }

    @Post("favorite")
    @UseGuards(JwtGuard)
    async addToFavorite(@Body() data: AddFavoriteDTO, @Req() request: Request) {
        const userId = request["user"].sub;
        const { wordId } = data;
        return this.wordsService.addToFavorite({ wordId, userId });
    }
}
