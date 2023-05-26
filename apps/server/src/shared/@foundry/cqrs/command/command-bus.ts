import { CommandHandler } from './command-handler.js'
import { Command } from './command.js'

/**
 * Command bus is responsible for sending commands from the client or application to the appropriate command
 * h andler for processing. It acts as an intermediary between the client and the command handler, encapsulating the details of how the command is sent and processed.
 */
export abstract class CommandBus {
	/** Ensure execution of command */
	abstract handle(command: Command): Promise<void>

	/** Fire and forget */
	abstract dispatch(command: Command): Promise<void>

	/**
	 * This method is used to register command handlers with the bus. It usually takes a command type (or a name, or
	 * a  key, etc.) and a handler as parameters.
	 */
	abstract subscribe(command: Command, handler: CommandHandler): Promise<void>

	/**
	 * This method is used to unregister command handlers with the bus. It usually takes a command type (or a name, or
	 * a  key, etc.) and a handler as parameters.
	 *
	 * @param command
	 * @param handler
	 */
	abstract unsubscribe(command: Command, handler: CommandHandler): Promise<void>
}
