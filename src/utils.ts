import { JSDOM } from "jsdom";
import { currencies } from "./currencies.js";

export async function fetchRetries (fn: () => Promise<any>, retries = 3) {
	for (let i = 0; i < retries; i++) {
		try {
			return await fn();
		}
		catch (error) {
			console.log("Error fetching data", error);
			console.log("Retrying...");
			continue;
		}
	}
    
	throw new Error("Error fetching data");
}

export function formatDate (date: Date) {
	return date.toISOString().split("T")[0].split("-").join(".");
}

export async function getResultFromHTML (text: string){
	const dom = new JSDOM(text);

	const table = dom.window.document.querySelector(".table-BCRA") as HTMLTableElement;

	const rows = Array.from(table.rows).slice(2);

	if(rows.length === 0) throw new Error("No data found");

	const cells = Array.from(rows[0].cells).slice(1);
	const lastCell = cells.pop();
	const data = parseFloat(lastCell?.textContent?.trim().replace(",", ".") || "");

	if(isNaN(data)) throw new Error("No data found");

	return data;
}

export async function validateLatestDate (date: string){
	return await fetchRetries(async () => {
		const URL = "https://www.bcra.gob.ar/PublicacionesEstadisticas/Evolucion_moneda.asp";

		const response = await fetch(URL);
		const text = await response.text();

		const dates = await parseOptionDatesFromHTML(text);

		if(dates?.includes(date)){
			return date;
		} else {
			// Return latest date previous to the one requested
			return dates?.find((d) => new Date(d || "") < new Date(date)) || "";
		}
	}, 3);
}

async function parseOptionDatesFromHTML (text: string) {
	const select = text.match(/<select name="Fecha"[\s\S]*?<\/select>/g)?.[0].replace(/\n|\r|\t/g, "");
	const options = select?.match(/<option value=([\s\S]*?)>([\s\S]*?)<\/option>/g);        
	const dates = options?.map((option) => option.match(/<option value=([\s\S]*?)>/)?.[1]) || [];

	return dates;
}

export async function getFullFetchURL (date: string, currency: string){
	// Get currency id from name
	const currencyId = currencies.find((c) => c.name === currency)?.id;
    
	const params = new URLSearchParams({
		// tipo: "E", // I don't know what this is
		Moneda: currencyId || "",
		Fecha: date,
	});
    
	const URL = "https://www.bcra.gob.ar/PublicacionesEstadisticas/Evolucion_moneda_3.asp?" + params.toString();

	return URL;
}