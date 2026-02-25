import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { DATABASE_MODULE_TOKENS } from "src/modules/db/constants/db-tokens.constants";
import type { IDatabaseService } from "src/modules/db/domain/ports/database.port";
import type { IWordRepository } from "../../domain/ports/word-repository.port";
import { WordEntity } from "../../domain/entities/word.entity";
import type { TWordEntry } from "@shared/schemas/dictionary/words.schema";
import { WORDS_ERRORS } from "src/commons/constants/errors/words-erros.constants";
import { WORD_INCLUDE } from "../../constants/dictionary.constants";

@Injectable()
export class WordRepository implements IWordRepository {
    private readonly prisma: PrismaClient;

    constructor(
        @Inject(DATABASE_MODULE_TOKENS.DATABASE_SERVICE)
        private readonly database: IDatabaseService
    ) {
        this.prisma = this.database.getClient();
    }

    async findByWord(word: string): Promise<WordEntity | null> {
        const normalized = word.toLowerCase().trim();
        const result = await this.prisma.word.findFirst({
            where: { word: normalized },
            include: WORD_INCLUDE,
        });
        return result ? WordEntity.fromPrisma(result) : null;
    }

    async createFromApiEntry(entry: TWordEntry): Promise<WordEntity> {
        const word = entry.word.toLowerCase().trim();
        try {
            const created = await this.prisma.word.create({
                data: {
                    word,
                    phonetic: entry.phonetic ?? null,
                    origin: entry.origin ?? null,
                    phonetics: entry.phonetics?.length
                        ? {
                              create: entry.phonetics
                                  .filter((p) => p.text != null && p.text !== "")
                                  .map((p) => ({
                                      text: p.text!,
                                      audio: p.audio ?? null,
                                  })),
                          }
                        : undefined,
                    meanings: entry.meanings?.length
                        ? {
                              create: entry.meanings.map((m) => ({
                                  partOfSpeech: m.partOfSpeech,
                                  definitions: m.definitions?.length
                                      ? {
                                            create: m.definitions.map((d) => ({
                                                definition: d.definition,
                                                example: d.example ?? null,
                                                synonyms: d.synonyms?.length
                                                    ? { create: d.synonyms.map((value) => ({ value })) }
                                                    : undefined,
                                                antonyms: d.antonyms?.length
                                                    ? { create: d.antonyms.map((value) => ({ value })) }
                                                    : undefined,
                                            })),
                                        }
                                      : undefined,
                              })),
                          }
                        : undefined,
                },
                include: WORD_INCLUDE,
            });
            return WordEntity.fromPrisma(created);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                const existing = await this.findByWord(word);
                if (existing) return existing;
            }
            throw e;
        }
    }

    async addToFavorite(data: { wordId: number; userId: number }): Promise<void> {
        const { wordId, userId } = data;
        try {
            await this.prisma.favorite_Word.create({
                data: { word_id: wordId, user_id: userId },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                throw new BadRequestException(WORDS_ERRORS.WORD_ALREADY_IN_FAVORITE);
            }
            throw e;
        }
    }
}
