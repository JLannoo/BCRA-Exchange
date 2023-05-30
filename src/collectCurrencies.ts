import { JSDOM } from "jsdom";
import fs from "node:fs";

import { CurrencyObject } from "./types";

const DEFAULT_CHARSET = "iso-8859-1";
/**
 * Collects all currencies from the BCRA website and saves them to `currencies.ts`
 * 
 * That file is then used for the autocomplete feature in the function using Typescript's const assertion
 */
async function collectCurrencies () {
    console.log("Collecting currencies...")

	const response = await fetch("https://www.bcra.gob.ar/PublicacionesEstadisticas/Evolucion_moneda.asp");

	// Get charset from response in case it changes
	const contentType = response.headers.get("content-type") || "";
	const charset = contentType.split("charset=")[1] || DEFAULT_CHARSET;

	const buffer = await response.arrayBuffer();
	const string = new TextDecoder(charset).decode(buffer);

	const dom = new JSDOM(string);

	const select = dom.window.document.querySelector("select[name='Moneda']") as HTMLSelectElement;
	const currencies = Array.from(select.options)
		.reduce((acc: CurrencyObject[], option) => {
			if (option.value !== "") {
				acc.push({
					id: option.value,
					name: option.text,
				});
			}
			return acc;
		}, [])
		.sort((a,b) => Number(a.id) - Number(b.id))
		.slice(1); // Remove first element, which is "Seleccione Moneda"

    console.log(currencies);    

    console.log("Saving currencies to currencies.ts...");
	fs.writeFileSync("./src/currencies.ts", `export const currencies = ${JSON.stringify(currencies, null, 4)} as const;`);

    console.log("Done!");
}
collectCurrencies();