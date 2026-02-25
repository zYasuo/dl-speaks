export interface IPhoneticEntity {
    id: number;
    text: string;
    audio: string | null;
}

export class PhoneticEntity implements IPhoneticEntity {
    id: number;
    text: string;
    audio: string | null;

    constructor(data: IPhoneticEntity) {
        this.id = data.id;
        this.text = data.text;
        this.audio = data.audio;
    }

    static fromPrisma(prisma: { id: number; text: string; audio: string | null }): PhoneticEntity {
        return new PhoneticEntity({
            id: prisma.id,
            text: prisma.text,
            audio: prisma.audio,
        });
    }
}
