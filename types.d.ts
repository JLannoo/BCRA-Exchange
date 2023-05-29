import { currencies } from "./src/currencies";

export interface CurrencyObject {
    id: string;
    name: string;
}

export interface Result {
    /** Date tried to fetch (passed as parameter)  */
    dateTried: Date;
    /** Latest date where BCRA closed an excange rate previous to ` ` */
    dateFetched: Date;
    /** Currency name */
    currency: CurrencyObject["name"];
    /** Value reported by BCRA at `date` */
    value: number;
}

export type CurrenciesEnum = typeof currencies[number]["name"];

declare module "BCRA-Wrapper" {
    export function getCurrencyToday(currency: CurrenciesEnum): Promise<Result>;
    export function getCurrencyByDate(currency: CurrenciesEnum, date: Date): Promise<Result>;
}