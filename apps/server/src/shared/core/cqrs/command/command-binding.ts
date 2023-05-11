import { Command } from './command'
import { CommandHandler } from './command-handler'

export interface CommandBinding {
	handler: CommandHandler
	command: typeof Command | any
}
