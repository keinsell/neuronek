type SequentialIDBrand = {
	readonly SequentialID: unique symbol
}

export type SequentialID = number & SequentialIDBrand

export function sequentialId(id: number): SequentialID {
	return id as SequentialID
}
