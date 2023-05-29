import { it, describe, expect } from "vitest";

import { getCurrencyToday , getCurrencyByDate } from "../src/main";
import { CurrenciesEnum, Result } from "../types";

describe("test", () => {
	it("should work", () => {
		expect(1).toBe(1);
	});

	const currency: CurrenciesEnum = "Dolar Estadounidense";

	it("should get today's currency", async () => {
		const result = await getCurrencyToday(currency);

		console.log(result);
		
		expect(result).toMatchObject<Result>({
			currency: currency,
			value: expect.any(Number),
			dateTried: expect.any(Date),
			dateFetched: expect.any(Date),
		});
		
		// dateFetched should be previous or equal to dateTried
		expect(result.dateFetched.getTime()).toBeLessThanOrEqual(result.dateTried.getTime());
	});

	it("should get currency by date", async () => {
		const date = new Date("2021-01-01");
		const result = await getCurrencyByDate(currency, date);		

		console.log(result);		

		expect(result).toMatchObject<Result>({
			currency: currency,
			value: expect.any(Number),
			dateTried: expect.any(Date),
			dateFetched: expect.any(Date),
		});
		
		// dateFetched should be previous or equal to dateTried
		expect(result.dateFetched.getTime()).toBeLessThanOrEqual(result.dateTried.getTime());
	});

	it("should throw error if date is invalid", async () => {
		const date = "hola";
		await expect(getCurrencyByDate(currency, date as any)).rejects.toThrowError();
	});

	it("should throw error if currency is invalid", async () => {
		const currency = "hola";
		await expect(getCurrencyByDate(currency as any, new Date())).rejects.toThrowError();
	});
});