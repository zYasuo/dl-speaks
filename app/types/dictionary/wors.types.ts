export interface IPhonetic {
    text?: string;
    audio?: string;
}

export interface IDefinition {
    definition: string;
    example?: string;
    synonyms?: string[];
    antonyms?: string[];
}

export interface IMeaning {
    partOfSpeech: string;
    definitions: IDefinition[];
}

export interface IWordEntry {
    word: string;
    phonetic?: string;
    phonetics?: IPhonetic[];
    origin?: string;
    meanings: IMeaning[];
}

export type IWords = IWordEntry | IWordEntry[];

export interface IRecentWords {
    words: string[];
}

