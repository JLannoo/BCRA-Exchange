import { describe , it, expect, vi, afterEach } from "vitest";

import { getCurrencyByDate, getCurrencyToday } from "../src/main";
import { CurrenciesEnum } from "../src/types";

import { InvalidCurrencyError, InvalidDateError, NodeVersionError, NoDataError, DateTooOldError, ServerConnectionError } from "../src/errors";

import * as consts from "../src/consts";

describe("Errors", () => {
	const currency: CurrenciesEnum = "Dolar Estadounidense";

	afterEach(() => {
		vi.clearAllMocks();
		vi.unstubAllGlobals();
	})

	it("should throw InvalidDateError if date is invalid", async () => {
		const date = "hola";
		await expect(getCurrencyByDate(currency, date as any)).rejects.toThrowError(InvalidDateError);
	});

    it("should throw DateTooOldError if date is too old", async () => {
        const date = new Date("1934-01-01"); // First availabe date is 1935-01-31
        await expect(getCurrencyByDate(currency, date)).rejects.toThrowError(DateTooOldError);
    });

	it("should throw InvalidCurrencyError if currency is invalid", async () => {
		const currency = "hola";
		await expect(getCurrencyToday(currency as any)).rejects.toThrowError(InvalidCurrencyError);
	});

	it("should throw NodeVersionError if `fetch` is not available", async () => {
		vi.stubGlobal("fetch", undefined); // Mock `fetch` to make it unavailable
		await expect(getCurrencyToday(currency)).rejects.toThrowError(NodeVersionError);
	});

    it("should throw ServerConnectionError if connection fails", async () => {
		// Mock BCRA_URLS.CURRENCY_SELECT to make it fail
		vi.spyOn(consts, "BCRA_URLS", "get").mockReturnValue({
			CURRENCY_SELECT: "INVALID_URL",
			CURRENCY_RESULT: "INVALID_URL",
		});
		
		await expect(getCurrencyToday(currency)).rejects.toThrowError(ServerConnectionError);
    });
});