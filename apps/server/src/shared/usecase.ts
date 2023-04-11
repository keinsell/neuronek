import { Result } from 'neverthrow'
import { Exception } from './exception.js'

export abstract class Usecase<INPUT, SUCCESS, ERROR extends Exception> {
	abstract execute(request: INPUT, ..._args: any[]): Promise<Result<SUCCESS, ERROR>>
}
