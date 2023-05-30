import { CurrenciesEnum, Result } from "./types";
import { fetchRetries, formatDate, getFullFetchURL, getResultFromHTML, validateLatestDate } from "./utils.js";

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