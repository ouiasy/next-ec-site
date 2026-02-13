export class RepositoryError extends Error {
	public override readonly name = "RepositoryError";

	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}
