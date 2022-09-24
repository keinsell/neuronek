import { Request, Response } from "@tinyhttp/app";

export abstract class Controller {
	protected req!: Request;
	protected res!: Response;

	protected abstract executeImplementation(
		...arguments_: unknown[]
	): Promise<Response>;

	public async execute(request: Request, response: Response) {
		this.req = request;
		this.res = response;

		await this.executeImplementation();
	}

	public static jsonResponse(
		response: Response,
		code: number,
		message: string,
	) {
		return response.status(code).json({ message });
	}

	public ok<T>(response: Response, dto?: T) {
		return dto ? response.status(200).json(dto) : response.sendStatus(200);
	}

	public created(response: Response) {
		return response.sendStatus(201);
	}

	public clientError(message?: string) {
		return Controller.jsonResponse(this.res, 400, message ?? "Unauthorized");
	}

	public unauthorized(message?: string) {
		return Controller.jsonResponse(this.res, 401, message ?? "Unauthorized");
	}

	public paymentRequired(message?: string) {
		return Controller.jsonResponse(
			this.res,
			402,
			message ?? "Payment required",
		);
	}

	public forbidden(message?: string) {
		return Controller.jsonResponse(this.res, 403, message ?? "Forbidden");
	}

	public notFound(message?: string) {
		return Controller.jsonResponse(this.res, 404, message ?? "Not found");
	}

	public conflict(message?: string) {
		return Controller.jsonResponse(this.res, 409, message ?? "Conflict");
	}

	public tooMany(message?: string) {
		return Controller.jsonResponse(
			this.res,
			429,
			message ?? "Too many requests",
		);
	}

	public todo() {
		return Controller.jsonResponse(this.res, 400, "TODO");
	}

	public fail(error: Error | string) {
		console.log(error);
		return this.res.status(500).json({
			message: error.toString(),
		});
	}
}
