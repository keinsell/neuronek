type SequentialIDBrand = {
	readonly SequentialID: unique symbol
}

export type SequentialID = number & SequentialIDBrand
