export interface SentenceToUpsert {
    externalId: number;
    text: string;
    lang: string;
}

export interface ISentenceRepository {
    upsertMany(sentences: SentenceToUpsert[]): Promise<number>;
}
