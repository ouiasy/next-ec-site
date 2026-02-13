
export class InvalidIdError extends Error {
	public override readonly name = "InvalidIdError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InvalidOrderError extends Error {
  public override readonly name = "InvalidOrderError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InvalidValueError extends Error {
	public override readonly name = "InvalidValueError";

	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export type OrderDomainError = InvalidIdError | InvalidOrderError | InvalidValueError;