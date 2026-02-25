import { Test, TestingModule } from "@nestjs/testing";
import { ClockAdapter } from "./clock.adapter";

describe("ClockAdapter", () => {
    let adapter: ClockAdapter;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ClockAdapter],
        }).compile();

        adapter = module.get(ClockAdapter);
    });

    describe("now", () => {
        it("should return a Date instance", () => {
            const result = adapter.now();
            expect(result).toBeInstanceOf(Date);
        });
    });

    describe("getToday", () => {
        it("should return date with UTC hours/minutes/seconds zeroed", () => {
            const result = adapter.getToday();
            expect(result).toBeInstanceOf(Date);
            expect(result.getUTCHours()).toBe(0);
            expect(result.getUTCMinutes()).toBe(0);
            expect(result.getUTCSeconds()).toBe(0);
            expect(result.getUTCMilliseconds()).toBe(0);
        });
    });
});
