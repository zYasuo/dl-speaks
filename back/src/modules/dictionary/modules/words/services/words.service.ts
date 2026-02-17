import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { PrismaClient, Word } from "@prisma/client";
import { DATABASE_MODULE_TOKENS } from "src/modules/db/constants/db-tokens.constants";
import type { IDatabaseService } from "src/modules/db/services/interfaces/database-config-service.interface";
import type { DictionaryEntry } from "../../../client/client.api";
import { REDIS_MODULE_TOKENS } from "src/modules/redis/constants/redis-tokens.constants";
import type { ICacheService } from "src/modules/redis/services/interfaces/cache-service.interface";
import type { IWordService } from "./interfaces/words-service.interface";
import { WORDS_ERRORS } from "src/commons/constants/errors/words-erros.constants";
import { RECENT_WORDS_CACHE_KEY, RECENT_WORDS_CACHE_TTL_SECONDS, RECENT_WORDS_MAX_SIZE } from "../constants/words.constants";

@Injectable()
export class WordsService implements IWordService {
    private readonly prisma: PrismaClient;

    constructor(
        @Inject(DATABASE_MODULE_TOKENS.DATABASE_SERVICE) private readonly database: IDatabaseService,
        @Inject(REDIS_MODULE_TOKENS.CACHE) private readonly cache: ICacheService
    ) {
        this.prisma = this.database.getClient();
    }

    async findByWord(word: string): Promise<Word | null> {
        const cached = await this.cache.get(word);
        if (cached) {
            return JSON.parse(cached) as Word;
        }

        const result = await this.prisma.word.findFirst({
            where: { word: word.toLowerCase().trim() },
            include: { phonetics: true, meanings: { include: { definitions: { include: { synonyms: true, antonyms: true } } } } }
        });
        if (result) {
            await this.cache.set(`word:${word}`, JSON.stringify(result), 60 * 60 * 24);
        }
        return result;
    }

    async createFromApiEntry(entry: DictionaryEntry): Promise<Word> {
        const word = entry.word.toLowerCase().trim();
        return this.prisma.word.create({
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
                                  audio: p.audio ?? null
                              }))
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
                                            synonyms: d.synonyms?.length ? { create: d.synonyms.map((value) => ({ value })) } : undefined,
                                            antonyms: d.antonyms?.length ? { create: d.antonyms.map((value) => ({ value })) } : undefined
                                        }))
                                    }
                                  : undefined
                          }))
                      }
                    : undefined
            },
            include: {
                phonetics: true,
                meanings: { include: { definitions: { include: { synonyms: true, antonyms: true } } } }
            }
        });
    }

    async recentWords(): Promise<string[]> {
        const cached = await this.cache.get(RECENT_WORDS_CACHE_KEY);
        if (cached) {
            return JSON.parse(cached) as string[];
        }
        return [];
    }

    async addToRecentWords(word: string): Promise<void> {
        const normalized = word.toLowerCase().trim();
        if (!normalized) return;

        let list: string[] = [];
        const cached = await this.cache.get(RECENT_WORDS_CACHE_KEY);
        if (cached) {
            list = JSON.parse(cached) as string[];
        }
        list = [normalized, ...list.filter((w) => w !== normalized)].slice(0, RECENT_WORDS_MAX_SIZE);
        await this.cache.set(RECENT_WORDS_CACHE_KEY, JSON.stringify(list), RECENT_WORDS_CACHE_TTL_SECONDS);
    }

    async addToFavorite(data: { wordId: number; userId: number }): Promise<void> {
        const { wordId, userId } = data;

        if (await this.isWordAlreadyInFavorite(wordId, userId)) {
            throw new BadRequestException(WORDS_ERRORS.WORD_ALREADY_IN_FAVORITE);
        }

        await this.prisma.favorite_Word.create({
            data: {
                word_id: wordId,
                user_id: userId
            }
        });
    }

    private async isWordAlreadyInFavorite(wordId: number, userId: number): Promise<boolean> {
        const result = await this.prisma.favorite_Word.findFirst({
            where: { word_id: wordId, user_id: userId }
        });
        return result !== null;
    }
}
