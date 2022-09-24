export class ApplicationError {
	error: unknown;

	public constructor(error: unknown) {
		this.error = error;
		this.toConsole();
	}

	protected toConsole() {
		console.error(this.error);
	}
}
