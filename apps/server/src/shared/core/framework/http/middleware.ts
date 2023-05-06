import { Response } from './response'
import { Request } from './request'
import { NextFunction } from './next-function'

export abstract class Middleware {
	abstract use(req: Request, res: Response, next: NextFunction): void
}
