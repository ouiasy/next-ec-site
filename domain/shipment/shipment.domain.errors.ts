export class InvalidIdError extends Error {
	public override readonly name = "InvalidUserIdError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InvalidShipmentStatusError extends Error {
  public override readonly name = "InvalidShipmentStatusError";

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

export type ShipmentDomainError = InvalidIdError | InvalidShipmentStatusError | InvalidValueError;