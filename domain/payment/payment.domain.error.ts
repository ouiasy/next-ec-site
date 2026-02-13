
export type PaymentDomainError = 
  | InvalidAmountError
  | InvalidCurrencyError
  | InvalidStatusError
  | InvalidMethodError
  | InvalidTransactionIdError
  | InvalidOrderIdError
  | InvalidPaymentError;

export class InvalidAmountError extends Error {
  public override readonly name = "InvalidAmountError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InvalidCurrencyError extends Error {
  public override readonly name = "InvalidCurrencyError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InvalidStatusError extends Error {
  public override readonly name = "InvalidStatusError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InvalidMethodError extends Error {
  public override readonly name = "InvalidMethodError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InvalidTransactionIdError extends Error {
  public override readonly name = "InvalidTransactionIdError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InvalidOrderIdError extends Error {
  public override readonly name = "InvalidOrderIdError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}


export class InvalidPaymentError extends Error {
  public override readonly name = "InvalidPaymentError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}