import { Entity } from './enity.js'

export abstract class Aggregate extends Entity {
	protected constructor(id?: string) {
		super(id)
	}
}
