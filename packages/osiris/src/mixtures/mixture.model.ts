import { Dosage } from '../dosage/dosage.js'
import { RouteOfAdministrationClassification } from '../route-of-administration/RouteOfAdministrationClassification.js'
import { MixtureIngredient } from './intrigents.mixture.model.js'

export class Mixture {
	id: number
	name: string
	labeller?: string
	routeOfAdministration?: RouteOfAdministrationClassification
	/** Tablets, Capsules, Powder, Liquid etc. */
	form?: string
	// TODO: Add serving information
	ingredients: Array<MixtureIngredient>

	private constructor(properties: {
		id?: number
		name: string
		labeller?: string
		routeOfAdministration?: RouteOfAdministrationClassification
		form?: string
		ingredients: Array<MixtureIngredient>
	}) {
		this.id = properties.id
		this.name = properties.name
		this.labeller = properties.labeller
		this.routeOfAdministration = properties.routeOfAdministration
		this.form = properties.form
		this.ingredients = properties.ingredients
	}

	static create(properties: {
		id?: number
		name: string
		labeller?: string
		routeOfAdministration?: RouteOfAdministrationClassification
		form?: string
		ingredients: Array<MixtureIngredient>
	}): Mixture {
		return new Mixture(properties)
	}
}
