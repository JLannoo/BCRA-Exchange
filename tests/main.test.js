var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { it, describe, expect } from "vitest";
import { getCurrencyToday, getCurrencyByDate } from "../src/main";
describe("test", () => {
    it("should work", () => {
        expect(1).toBe(1);
    });
    const currency = "Dolar Estadounidense";
    it("should get today's currency", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield getCurrencyToday(currency);
        console.log(result);
        expect(result).toMatchObject({
            currency: currency,
            value: expect.any(Number),
            dateTried: expect.any(Date),
            dateFetched: expect.any(Date),
        });
        // dateFetched should be previous or equal to dateTried
        expect(result.dateFetched.getTime()).toBeLessThanOrEqual(result.dateTried.getTime());
    }));
    it("should get currency by date", () => __awaiter(void 0, void 0, void 0, function* () {
        const date = new Date("2021-01-01");
        const result = yield getCurrencyByDate(currency, date);
        console.log(result);
        expect(result).toMatchObject({
            currency: currency,
            value: expect.any(Number),
            dateTried: expect.any(Date),
            dateFetched: expect.any(Date),
        });
        // dateFetched should be previous or equal to dateTried
        expect(result.dateFetched.getTime()).toBeLessThanOrEqual(result.dateTried.getTime());
    }));
    it("should throw error if date is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const date = "hola";
        yield expect(getCurrencyByDate(currency, date)).rejects.toThrowError();
    }));
    it("should throw error if currency is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const currency = "hola";
        yield expect(getCurrencyByDate(currency, new Date())).rejects.toThrowError();
    }));
});
