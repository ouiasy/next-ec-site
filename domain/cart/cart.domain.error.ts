
export type CartDomainError = ProductNotFoundError | InvalidIdError | InvalidQuantityError;

export class ProductNotFoundError extends Error {
  public override readonly name = "ProductNotFoundError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InvalidIdError extends Error {
  public override readonly name = "InvalidIdError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InvalidQuantityError extends Error {
  public override readonly name = "InvalidQuantityError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
