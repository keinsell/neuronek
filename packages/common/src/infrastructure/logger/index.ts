export abstract class Logger {
	abstract log(message: any, ...meta: unknown[]): void
	abstract error(
		message: any,
		trace?: unknown,
		...meta: unknown[]
	): void
	abstract warn(message: any, ...meta: unknown[]): void
	abstract debug(message: any, ...meta: unknown[]): void
}