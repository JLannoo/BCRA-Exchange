export const BCRA_URLS = {
    CURRENCY_SELECT: "https://www.bcra.gob.ar/PublicacionesEstadisticas/Evolucion_moneda.asp",
    CURRENCY_RESULT: "https://www.bcra.gob.ar/PublicacionesEstadisticas/Evolucion_moneda_3.asp",
}

export const DEFAULT_CHARSET = "iso-8859-1";

export const SELECTORS = {
    CURRENCY_SELECT: "select[name=Moneda]",
};

export const REGEX = {
    DATE_SELECT: /<select name="Fecha"[\s\S]*?<\/select>/g,
    SELECT_OPTIONS: /<option value=([\s\S]*?)>([\s\S]*?)<\/option>/g,
    SELECT_OPTION_VALUE: /<option value=([\s\S]*?)>/,
}