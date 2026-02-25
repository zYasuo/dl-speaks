export interface IAntonymEntity {
    id: number;
    value: string;
}

export class AntonymEntity implements IAntonymEntity {
    id: number;
    value: string;

    constructor(data: IAntonymEntity) {
        this.id = data.id;
        this.value = data.value;
    }

    static fromPrisma(prisma: { id: number; value: string }): AntonymEntity {
        return new AntonymEntity({ id: prisma.id, value: prisma.value });
    }
}
