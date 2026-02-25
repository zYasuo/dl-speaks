import { Test, TestingModule } from "@nestjs/testing";
import { HttpService } from "@nestjs/axios";
import { of } from "rxjs";
import { DICTIONARY_MODULE_TOKENS } from "../../constants/dictionary.tokens";
import { TatoebaClient } from "./tatoeba.client";

const mockHttpService = {
    post: jest.fn(),
};

describe("TatoebaClient", () => {
    let client: TatoebaClient;
    const baseUrl = "https://api.test.org/";

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TatoebaClient,
                {
                    provide: DICTIONARY_MODULE_TOKENS.TATOEBA_API_URL,
                    useValue: baseUrl,
                },
                {
                    provide: HttpService,
                    useValue: mockHttpService,
                },
            ],
        }).compile();

        client = module.get(TatoebaClient);
    });

    it("should return sentences from JSON-RPC response", async () => {
        const sentences = [
            { id: 1, text: "Hello.", lang: "eng" },
            { id: 2, text: "Bye.", lang: "eng" },
        ];
        mockHttpService.post.mockReturnValue(
            of({
                data: {
                    jsonrpc: "2.0",
                    id: 1,
                    result: { version: 1, total: 2, sentences },
                },
            })
        );

        const result = await client.searchSentences({
            from: "eng",
            query: "hello",
            page: [0, 10],
        });

        expect(mockHttpService.post).toHaveBeenCalledWith(
            baseUrl,
            expect.objectContaining({
                jsonrpc: "2.0",
                method: "search",
                params: expect.objectContaining({
                    from: "eng",
                    query: "hello",
                    page: [0, 10],
                }),
            }),
            expect.any(Object)
        );
        expect(result).toEqual(sentences);
    });

    it("should throw when API returns error", async () => {
        mockHttpService.post.mockReturnValue(
            of({
                data: {
                    jsonrpc: "2.0",
                    id: 1,
                    error: { message: "Invalid language" },
                },
            })
        );

        await expect(
            client.searchSentences({ from: "eng", query: "x" })
        ).rejects.toThrow("Tatoeba API error");
    });
});
