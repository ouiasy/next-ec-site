export type ProductDomainError =
	| EmptyValueError
	| InvalidPriceError
	| InvalidTaxRateError
	| InvalidStockError;

export class EmptyValueError extends Error {
	public override readonly name = "EmptyProductNameError";

	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export class InvalidPriceError extends Error {
	public override readonly name = "InvalidPriceError";

	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export class InvalidTaxRateError extends Error {
	public override readonly name = "InvalidTaxRateError";

	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export class InvalidStockError extends Error {
	public override readonly name = "InvalidStockError";

	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}
