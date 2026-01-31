import { OptionIcon } from "lucide-react";

export type AddressDomainError =
	| InvalidUserIdError
	| InvalidPostalCodeError
	| EmptyFieldError;

export class InvalidUserIdError extends Error {
	public override readonly name = "InvalidUserIdError";

	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export class InvalidPostalCodeError extends Error {
	public override readonly name = "InvalidPostalCodeError";

	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export class EmptyFieldError extends Error {
	public override readonly name = "EmptyFieldError";

	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}
