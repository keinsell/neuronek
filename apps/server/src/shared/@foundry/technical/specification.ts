export abstract class Specification<T = unknown> {
	abstract satisfy(i: T): boolean
}
