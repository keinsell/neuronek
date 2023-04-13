import { Request } from './request'
import { Response } from './response'

export abstract class Controller {
	protected req: Request
	protected res: Response

	protected abstract executeImpl(): Promise<Response>

	public execute(request: Request, response: Response): void {
		this.req = request
		this.res = response

		this.executeImpl()
	}

	public static json(response: Response, code: number, message: string) {
		return response.status(code).json({ message })
	}

	public ok<T>(response: Response, dto?: T) {
		return dto ? response.status(200).json(dto) : response.sendStatus(200)
	}

	public created(response: Response) {
		return response.sendStatus(201)
	}

	public clientError(message?: string) {
		return Controller.json(this.res, 400, message ?? 'Unauthorized')
	}

	public unauthorized(message?: string) {
		return Controller.json(this.res, 401, message ?? 'Unauthorized')
	}

	public paymentRequired(message?: string): Response {
		return Controller.json(this.res, 402, message ?? 'Payment required')
	}

	public forbidden(message?: string): Response {
		return Controller.json(this.res, 403, message ?? 'Forbidden')
	}

	public notFound(message?: string) {
		return Controller.json(this.res, 404, message ?? 'Not found')
	}

	public conflict(message?: string) {
		return Controller.json(this.res, 409, message ?? 'Conflict')
	}

	public tooMany(message?: string) {
		return Controller.json(this.res, 429, message ?? 'Too many requests')
	}

	public todo() {
		return Controller.json(this.res, 400, 'TODO')
	}

	public fail(error: Error | string) {
		console.log(error)
		return this.res.status(500).json({
			message: error.toString()
		})
	}
}
