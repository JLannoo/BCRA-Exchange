export class NoDataError extends Error {
    constructor() {
        super("No data found");
        this.name = "NoDataError";
    }
}

export class InvalidDateError extends Error {
    constructor() {
        super("Invalid date");
        this.name = "InvalidDateError";
    }
}

export class InvalidCurrencyError extends Error {
    constructor() {
        super("Invalid currency");
        this.name = "InvalidCurrencyError";
    }
}

export class DateTooOldError extends Error {
    constructor() {
        super("Date too old");
        this.name = "DateTooOldError";
    }
}

export class NodeVersionError extends Error {
    constructor() {
        super("`fetch` is not available in this Node.js version. Please use Node.js >= 18");
        this.name = "NodeVersionError";
    }
}

export class ServerConnectionError extends Error {
    constructor() {
        super("Could not connect to server");
        this.name = "ServerConnectionError";
    }
}
