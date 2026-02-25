import { SynonymEntity } from "./synonym.entity";
import { AntonymEntity } from "./antonym.entity";

export interface IDefinitionEntity {
    id: number;
    definition: string;
    example: string | null;
    synonyms: SynonymEntity[];
    antonyms: AntonymEntity[];
}

export class DefinitionEntity implements IDefinitionEntity {
    id: number;
    definition: string;
    example: string | null;
    synonyms: SynonymEntity[];
    antonyms: AntonymEntity[];

    constructor(data: IDefinitionEntity) {
        this.id = data.id;
        this.definition = data.definition;
        this.example = data.example;
        this.synonyms = data.synonyms;
        this.antonyms = data.antonyms;
    }

    static fromPrisma(prisma: {
        id: number;
        definition: string;
        example: string | null;
        synonyms: { id: number; value: string }[];
        antonyms: { id: number; value: string }[];
    }): DefinitionEntity {
        return new DefinitionEntity({
            id: prisma.id,
            definition: prisma.definition,
            example: prisma.example,
            synonyms: prisma.synonyms.map((s) => SynonymEntity.fromPrisma(s)),
            antonyms: prisma.antonyms.map((a) => AntonymEntity.fromPrisma(a)),
        });
    }
}
