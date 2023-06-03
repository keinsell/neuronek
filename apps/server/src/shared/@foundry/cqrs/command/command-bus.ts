import { CommandHandler } from './command-handler.js'
import { Command }        from './command.js'



/**
 * Command bus is responsible for sending commands from the client or application to the appropriate command
 * h andler for processing. It acts as an intermediary between the client and the command handler, encapsulating the details of how the command is sent and processed.
 */
export abstract class CommandBus {
	/** Ensure execution of command */
	abstract handle(command: Command): Promise<void>

	/** Fire and forget */
	abstract dispatch(command: Command): Promise<void>

	abstract subscribe<T extends Command>(commandClass: new (...args: any[]) => T, handler: CommandHandler): Promise<void>

	abstract unsubscribe<T extends Command>(
		commandClass: new (...args: any[]) => T,
		handler: CommandHandler
	): Promise<void>
}
