import { it, describe, expect } from "vitest";

import { getCurrencyToday , getCurrencyByDate } from "../src/main";
import { CurrenciesEnum, Result } from "../src/types";

describe("Main", () => {
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
});