import { JSDOM } from "jsdom";
import { CurrenciesEnum, CurrencyObject, Result } from "./types";
import fs from "node:fs";

import { fetchRetries, formatDate, getFullFetchURL, getResultFromHTML, validateLatestDate } from "./utils.js";

const DEFAULT_CHARSET = "iso-8859-1";

/**
 * Collects all currencies from the BCRA website and saves them to `currencies.ts`
 * 
 * That file is then used for the autocomplete feature in the function using Typescript's const assertion
 */
async function collectCurrencies () {
	const response = await fetch("https://www.bcra.gob.ar/PublicacionesEstadisticas/Evolucion_moneda.asp");

	// Get charset from response in case it changes
	const contentType = response.headers.get("content-type") || "";
	const charset = contentType.split("charset=")[1] || DEFAULT_CHARSET;

	const buffer = await response.arrayBuffer();
	const string = new TextDecoder(charset).decode(buffer);

	const dom = new JSDOM(string);

	const select = dom.window.document.querySelector("select[name='Moneda']") as HTMLSelectElement;
	const currencies = Array.from(select.options).reduce((acc: CurrencyObject[], option) => {
		if (option.value !== "") {
			acc.push({
				id: option.value,
				name: option.text,
			});
		}
		return acc;
	}, []).sort((a,b) => Number(a.id) - Number(b.id));

	fs.writeFileSync("./currencies.ts", `export const currencies = ${JSON.stringify(currencies, null, 4)} as const;`);
}
// collectCurrencies();

/**
 * Gets today's value of a currency
 */
export async function getCurrencyToday (currency: CurrenciesEnum): Promise<Result> {
	const today = new Date();
	return getCurrencyByDate(currency, today);
}

export async function getCurrencyByDate (currency: CurrenciesEnum, date: Date): Promise<Result> {
	// Date in format YYYY.MM.DD
	const dateString = formatDate(date);
	const validatedDate = await validateLatestDate(dateString);
	const URL = await getFullFetchURL(validatedDate, currency);

	// Try to fetch data 3 times
	const retries = 3;
	const data = await fetchRetries(async () => {
		const response = await fetch(URL);
		const text = await response.text();
		return await getResultFromHTML(text);
	}
	, retries);

	return {
		dateTried: new Date(dateString),
		dateFetched: new Date(validatedDate),
		currency,
		value: data,
	};
}