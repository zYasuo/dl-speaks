import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { JwtGuard } from "src/modules/auth/jwt/guards/jwt-guard";
import { ZodValidationPipe } from "src/commons/pipes/zod-validation.pipe";
import type { TAddToFavorite } from "@shared/schemas/dictionary/add-to-favorite.schema";
import { SAddToFavorite } from "@shared/schemas/dictionary/add-to-favorite.schema";
import { GetRecentWordsUseCase } from "../../domain/use-cases/get-recent-words.use-case";
import { AddToFavoriteUseCase } from "../../domain/use-cases/add-to-favorite.use-case";

@Controller("words")
export class WordsController {
    constructor(
        private readonly getRecentWordsUseCase: GetRecentWordsUseCase,
        private readonly addToFavoriteUseCase: AddToFavoriteUseCase
    ) {}

    @Get("recent")
    async getRecentWords() {
        return this.getRecentWordsUseCase.execute();
    }

    @Post("favorite")
    @UseGuards(JwtGuard)
    async addToFavorite(
        @Body(new ZodValidationPipe(SAddToFavorite)) data: TAddToFavorite,
        @Req() request: Request
    ) {
        const userId = (request as unknown as { user: { sub: string } })["user"].sub;
        return this.addToFavoriteUseCase.execute({
            wordId: data.wordId,
            userId: Number(userId) || 0
        });
    }
}
