import { nanoid } from "nanoid";

export class JobQueueTask<Payload> {
	constructor(public data: Payload, public id?: string) {
		this.id = id || nanoid();
		this.data = data;
	}
}

export interface JobQueue<T> {
	executeImplementation(job: JobQueueTask<T>): Promise<void>;
	start(): Promise<void>;
	stop(): Promise<void>;
	enqueue(task: JobQueueTask<T>): Promise<void>;
	clear(): Promise<void>;
}
