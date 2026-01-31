class ItemsNotFoundError extends Error {
	public override readonly name = "ItemsNotFoundError";
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}
