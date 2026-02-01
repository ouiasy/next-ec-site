
export type CategoryDomainError = EmptyValueError | InvalidParentIdError | CategoryIdMismatchError;

export class EmptyValueError extends Error {
    public override readonly name = "EmptyValueError";
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class InvalidParentIdError extends Error {
    public override readonly name = "InvalidParentIdError";
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class CategoryIdMismatchError extends Error {
    public override readonly name = "CategoryIdMismatchError";
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}
