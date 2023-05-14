import { Exception } from './domain/exception.js'
import { Result } from './technical/result'

export abstract class UseCase<INPUT, SUCCESS, ERROR extends Exception> {
	abstract execute(request: INPUT): Promise<Result<SUCCESS, ERROR>>
}
