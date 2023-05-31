import { currencies } from "./currencies.js";
import { BCRA_URLS, REGEX } from "./consts.js";
import { DateTooOldError, InvalidCurrencyError, InvalidDateError, NoDataError, ServerConnectionError } from "./errors.js";

export async function fetchRetries (fn: () => Promise<any>, retries = 3) {
	for (let i = 0; i < retries; i++) {
		try {
			return await fn();
		} catch (error) {
			if (i === retries - 1) throw error;
		}
	}

	throw new ServerConnectionError();
}

export function formatDate (date: Date) {
	if(!(date instanceof Date)) throw new InvalidDateError();
	return date.toISOString().split("T")[0].split("-").join(".");
}

export async function getResultFromHTML (text: string){
	const match = text.match(REGEX.TABLE);
	if (!match) throw new NoDataError();

	const tableHtml = match[0];
	const rows = tableHtml.match(REGEX.TABLE_ROWS)?.slice(2) || [];

	if (rows.length === 0) throw new NoDataError();

	const cells = rows[0].match(REGEX.TABLE_CELLS)?.slice(1) || [];
	const lastCell = cells.pop();
	const lastCellText = lastCell?.match(REGEX.TABLE_CELL_VALUE)?.[1].trim();
	const data = parseFloat(lastCellText?.replace(",", ".") || "");

	if (isNaN(data)) throw new NoDataError();

	return data;
}

export async function validateLatestDate (date: string){
	return await fetchRetries(async () => {
		let response;
		try {
			response = await fetch(BCRA_URLS.CURRENCY_SELECT);
		} catch (error) {
			throw new ServerConnectionError();
		}

		const text = await response.text();

		const dates = await parseOptionDatesFromHTML(text);

		if(dates?.includes(date)){
			return date;
		} else {
			// Return latest date previous to the one requested
			const previousDate = dates?.find((d) => new Date(d || "") < new Date(date)) || "";			
			if(!previousDate || previousDate === "") throw new DateTooOldError();

			return previousDate;
		}
	}, 3);
}

async function parseOptionDatesFromHTML (text: string) {
	const select = text.match(REGEX.DATE_SELECT)?.[0].replace(/\n|\r|\t/g, "");
	const options = select?.match(REGEX.SELECT_OPTIONS);
	const dates = options?.map((option) => option.match(REGEX.SELECT_OPTION_VALUE)?.[1]) || [];

	if(dates.length === 0) throw new NoDataError();

	return dates;
}

export async function getFullFetchURL (date: string, currency: string){
	// Get currency id from name
	const currencyId = currencies.find((c) => c.name === currency)?.id;
	if(!currencyId) throw new InvalidCurrencyError();
    
	const params = new URLSearchParams({
		// tipo: "E", // I don't know what this is
		Moneda: currencyId || "",
		Fecha: date,
	});
    
	const URL = BCRA_URLS.CURRENCY_RESULT + "?" + params.toString();

	return URL;
}