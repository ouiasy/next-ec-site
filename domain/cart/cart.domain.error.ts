
export type CartDomainError = ProductNotFoundError;

export class ProductNotFoundError extends Error {
  public override readonly name = "ProductNotFoundError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}