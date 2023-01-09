import { ILogger } from ".";

export class ConsoleLogger implements ILogger {
	log(message: string, ...meta: unknown[]): void {
		console.log(message, meta);
	}
	error(message: string, trace?: unknown, ...meta: unknown[]): void {
		console.error(message, trace, meta);
	}
	warn(message: string, ...meta: unknown[]): void {
		console.warn(message, meta);
	}
	debug(message: string, ...meta: unknown[]): void {
		console.debug(message, meta);
	}
}
