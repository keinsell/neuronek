import { Result } from 'neverthrow'
import { DomainError } from './error.js'

export abstract class Usecase<INPUT, SUCCESS, ERROR extends DomainError> {
	abstract execute(request: INPUT, ..._args: any[]): Promise<Result<SUCCESS, ERROR>>
}
