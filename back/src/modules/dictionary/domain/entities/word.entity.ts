import { PhoneticEntity } from "./phonetic.entity";
import { MeaningEntity } from "./meaning.entity";

export interface IWordEntity {
    id: number;
    uuid: string;
    word: string;
    phonetic: string | null;
    origin: string | null;
    createdAt: Date;
    updatedAt: Date;
    phonetics: PhoneticEntity[];
    meanings: MeaningEntity[];
}

export class WordEntity implements IWordEntity {
    id: number;
    uuid: string;
    word: string;
    phonetic: string | null;
    origin: string | null;
    createdAt: Date;
    updatedAt: Date;
    phonetics: PhoneticEntity[];
    meanings: MeaningEntity[];

    constructor(word: IWordEntity) {
        this.id = word.id;
        this.uuid = word.uuid;
        this.word = word.word;
        this.phonetic = word.phonetic;
        this.origin = word.origin;
        this.createdAt = word.createdAt;
        this.updatedAt = word.updatedAt;
        this.phonetics = word.phonetics;
        this.meanings = word.meanings;
    }

    static fromPrisma(prisma: {
        id: number;
        uuid: string;
        word: string;
        phonetic: string | null;
        origin: string | null;
        created_at: Date;
        updated_at: Date;
        phonetics: { id: number; text: string; audio: string | null }[];
        meanings: {
            id: number;
            partOfSpeech: string;
            definitions: {
                id: number;
                definition: string;
                example: string | null;
                synonyms: { id: number; value: string }[];
                antonyms: { id: number; value: string }[];
            }[];
        }[];
    }): WordEntity {
        return new WordEntity({
            id: prisma.id,
            uuid: prisma.uuid,
            word: prisma.word,
            phonetic: prisma.phonetic,
            origin: prisma.origin,
            createdAt: prisma.created_at,
            updatedAt: prisma.updated_at,
            phonetics: prisma.phonetics.map((p) => PhoneticEntity.fromPrisma(p)),
            meanings: prisma.meanings.map((m) => MeaningEntity.fromPrisma(m)),
        });
    }

    toPrismaShape(): object {
        return {
            id: this.id,
            uuid: this.uuid,
            word: this.word,
            phonetic: this.phonetic,
            origin: this.origin,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            phonetics: this.phonetics.map((p) => ({ id: p.id, text: p.text, audio: p.audio })),
            meanings: this.meanings.map((m) => ({
                id: m.id,
                partOfSpeech: m.partOfSpeech,
                definitions: m.definitions.map((d) => ({
                    id: d.id,
                    definition: d.definition,
                    example: d.example,
                    synonyms: d.synonyms.map((s) => ({ id: s.id, value: s.value })),
                    antonyms: d.antonyms.map((a) => ({ id: a.id, value: a.value })),
                })),
            })),
        };
    }

    static fromCached(data: {
        id: number;
        uuid: string;
        word: string;
        phonetic: string | null;
        origin: string | null;
        created_at: string | Date;
        updated_at: string | Date;
        phonetics: { id: number; text: string; audio: string | null }[];
        meanings: {
            id: number;
            partOfSpeech: string;
            definitions: {
                id: number;
                definition: string;
                example: string | null;
                synonyms: { id: number; value: string }[];
                antonyms: { id: number; value: string }[];
            }[];
        }[];
    }): WordEntity {
        return WordEntity.fromPrisma({
            ...data,
            created_at: typeof data.created_at === "string" ? new Date(data.created_at) : data.created_at,
            updated_at: typeof data.updated_at === "string" ? new Date(data.updated_at) : data.updated_at,
        });
    }
}
