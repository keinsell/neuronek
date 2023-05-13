import * as E from 'fp-ts/lib/Either'

export type Result<Success, Failure> = E.Either<Success, Failure>

export function left<T = any>(payload: T): E.Either<T, any> {
	return E.left(payload)
}

export function right<T = any>(payload: T): E.Either<any, T> {
	return E.right(payload)
}
