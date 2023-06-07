import { Exception } from '../exceptions/exception.js'
import { Result } from '../technical/result.js'



export abstract class UseCase<INPUT, SUCCESS, ERROR extends Exception> {
  abstract execute(request: INPUT): Promise<Result<ERROR, SUCCESS>>
}
