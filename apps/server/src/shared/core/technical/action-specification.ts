export abstract class ActionSpecification<T = unknown> {
	abstract satisfy(i: T): Promise<boolean>
}
