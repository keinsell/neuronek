import { Handler } from '../../base/handler.js'
import { Command } from './command'



/** Command handler is responsible for processing a specific type of command. It receives a command as input from
 *  the command processor, performs validation, executes business logic, and updates the system's state accordingly.
 * Command handlers are typically registered with the command bus or processor, associating specific command types with
 * their respective handlers. This allows for dispatching commands to the appropriate handlers based on the command
 * type. */
export abstract class CommandHandler<COMMAND extends Command<unknown>>
  implements Handler<COMMAND, COMMAND['_response']> {
  public abstract handle(message: COMMAND): Promise<COMMAND['_response']> | COMMAND['_response']
}
