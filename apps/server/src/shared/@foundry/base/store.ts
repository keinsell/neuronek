export abstract class Store<E = unknown> {
	abstract save<T extends E>(entity : T) : Promise<void>;
}
