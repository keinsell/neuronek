import { NextFunction } from './next-function.js'
import { Request } from './request.js'
import { Response } from './response.js'

export abstract class Middleware {
	abstract use(request: Request, res: Response, next: NextFunction): void
}
