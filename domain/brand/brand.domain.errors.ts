
export class EmptyValueError extends Error {
    public override readonly name = "EmptyValueError";
    constructor(message: string) {
        super(message);
    }
}

export type BrandDomainError = EmptyValueError;