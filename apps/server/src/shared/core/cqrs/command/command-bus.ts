import { Command } from './command'

/** Command bus is responsible for sending commands from the client or application to the appropriate command
 * h andler for processing. It acts as an intermediary between the client and the command handler, encapsulating the details of how the command is sent and processed.
 */
export abstract class CommandBus {
	abstract send(command: Command): Promise<void>
}
