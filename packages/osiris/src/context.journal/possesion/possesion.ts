import { Mixture } from '../../context.mixture/mixture.model.js'
import { Substance } from '../../context.substance/substance.js'
import { Entity } from '../../shared.core/entity.js'

export interface PossesionProperties {
	quantity: number
	of: Substance | Mixture
}

export class Possesion extends Entity {
	of: Substance | Mixture
	quantity: number

	private constructor(properties: PossesionProperties, id?: any) {
		super(id)
		this.of = properties.of
		this.quantity = properties.quantity
	}

	static create(properties: PossesionProperties, id?: any) {
		return new Possesion(properties, id)
	}
}
