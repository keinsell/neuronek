import { nanoid } from "nanoid";

export type CommandProperties<T> = Omit<T, "correlationId" | "id"> &
	Partial<Command>;

export class Command {
	/**
	 * Command id, in case if we want to save it
	 * for auditing purposes and create a correlation/causation chain
	 */
	public readonly id: string;

	/** ID for correlation purposes (for commands that
	 *  arrive from other microservices,logs correlation, etc). */
	public readonly correlationId: string;

	/**
	 * Causation id to reconstruct execution order if needed
	 */
	public readonly causationId?: string;

	constructor(properties: CommandProperties<unknown>) {
		this.id = properties.id || nanoid();
		this.correlationId = properties.correlationId || nanoid();
		this.causationId = properties.causationId;
	}
}

export interface ICommandHandler<T extends Command> {
	execute(command: T): Promise<unknown>;
}
