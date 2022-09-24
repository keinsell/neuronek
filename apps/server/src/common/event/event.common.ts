export enum KnownDomainEvents { ingestedSubstance = "INGESTED_SUBSTANCE" }

export interface IDomesticEvent {
	eventName: KnownDomainEvents | string;
	timestamp: Date;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}

export const eventStorage: DomesticEvent[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DomesticEvent<T = any> implements IDomesticEvent {
	eventName: string;
	timestamp: Date;
	data: T;

	constructor(kind: KnownDomainEvents | string, data: T) {
		this.eventName = kind;
		this.timestamp = new Date();
		this.data = data;
		this.toConsole();
	}

	toConsole() {
		console.info(`[${this.timestamp.toISOString()}] ${this.eventName}`);
		console.debug(this.data);
	}
}
