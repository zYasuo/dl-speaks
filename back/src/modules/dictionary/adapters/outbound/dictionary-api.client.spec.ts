import { Test, TestingModule } from "@nestjs/testing";
import { HttpService } from "@nestjs/axios";
import { of, throwError } from "rxjs";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";
import { DictionaryApiClient } from "./dictionary-api.client";

const mockHttpService = {
    get: jest.fn(),
};

describe("DictionaryApiClient", () => {
    let client: DictionaryApiClient;
    const baseUrl = "https://api.dictionary.com";

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DictionaryApiClient,
                {
                    provide: DICTIONARY_MODULE_TOKENS.CLIENT_API,
                    useValue: baseUrl,
                },
                {
                    provide: HttpService,
                    useValue: mockHttpService,
                },
            ],
        }).compile();

        client = module.get(DictionaryApiClient);
    });

    it("should build URL with language and encoded word and return data", async () => {
        const apiData = [
            {
                word: "hello",
                phonetic: "həˈloʊ",
                origin: null,
                phonetics: [],
                meanings: [],
            },
        ];
        mockHttpService.get.mockReturnValue(of({ data: apiData }));

        const result = await client.getWord("en", "hello");

        expect(mockHttpService.get).toHaveBeenCalledWith(
            `${baseUrl}/en/hello`
        );
        expect(result).toEqual(apiData);
    });

    it("should encode special characters in word", async () => {
        mockHttpService.get.mockReturnValue(of({ data: [] }));

        await client.getWord("en", "café");

        expect(mockHttpService.get).toHaveBeenCalledWith(
            `${baseUrl}/en/caf%C3%A9`
        );
    });

    it("should propagate HTTP errors", async () => {
        mockHttpService.get.mockReturnValue(throwError(() => new Error("Network error")));

        await expect(client.getWord("en", "x")).rejects.toThrow("Network error");
    });
});
