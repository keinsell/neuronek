import { ClassConstructor } from '../../technical/class-constructor.js'
import { CommandHandler }   from './command-handler.js'
import { Command }          from './command.js'



/**
 * Command bus is responsible for sending commands from the client or application to the appropriate command
 * h andler for processing. It acts as an intermediary between the client and the command handler, encapsulating the
 * details of how the command is sent and processed.
 */
export abstract class CommandBus<COMMANDS extends Command<unknown>> {
	/** Ensure execution of command */
	abstract handle<T extends COMMANDS>(command : T) : T['_cast'] | Promise<T['_cast']>
	
	/** Fire and forget */
	abstract dispatch<T extends COMMANDS>(command : T) : Promise<void> | void
	
	abstract subscribe<T extends COMMANDS>(
		command : ClassConstructor<T>, handler : CommandHandler<T>) : Promise<void> | void
	
	abstract unsubscribe<T extends COMMANDS>(
		command : ClassConstructor<T>, handler : CommandHandler<T>) : Promise<void> | void
}
