export interface ISynonymEntity {
    id: number;
    value: string;
}

export class SynonymEntity implements ISynonymEntity {
    id: number;
    value: string;

    constructor(data: ISynonymEntity) {
        this.id = data.id;
        this.value = data.value;
    }

    static fromPrisma(prisma: { id: number; value: string }): SynonymEntity {
        return new SynonymEntity({ id: prisma.id, value: prisma.value });
    }
}
