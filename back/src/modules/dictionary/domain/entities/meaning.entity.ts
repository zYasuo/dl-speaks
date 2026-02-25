import { DefinitionEntity } from "./definition.entity";

export interface IMeaningEntity {
    id: number;
    partOfSpeech: string;
    definitions: DefinitionEntity[];
}

export class MeaningEntity implements IMeaningEntity {
    id: number;
    partOfSpeech: string;
    definitions: DefinitionEntity[];

    constructor(data: IMeaningEntity) {
        this.id = data.id;
        this.partOfSpeech = data.partOfSpeech;
        this.definitions = data.definitions;
    }

    static fromPrisma(prisma: {
        id: number;
        partOfSpeech: string;
        definitions: {
            id: number;
            definition: string;
            example: string | null;
            synonyms: { id: number; value: string }[];
            antonyms: { id: number; value: string }[];
        }[];
    }): MeaningEntity {
        return new MeaningEntity({
            id: prisma.id,
            partOfSpeech: prisma.partOfSpeech,
            definitions: prisma.definitions.map((d) => DefinitionEntity.fromPrisma(d)),
        });
    }
}
