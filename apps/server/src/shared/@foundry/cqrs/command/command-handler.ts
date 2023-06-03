import { Command } from './command'



export abstract class CommandHandler<T = Command> {
	abstract handle(command: T): Promise<void>
}
