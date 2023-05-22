import * as E from 'fp-ts/lib/Either.js'

export type Result<Failure, Success> = E.Either<Failure, Success>

export function left<T = any>(payload: T): E.Either<T, any> {
	return E.left(payload)
}

export function right<T = any>(payload: T): E.Either<any, T> {
	return E.right(payload)
}
