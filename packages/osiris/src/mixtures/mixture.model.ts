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
	serving_size?: Dosage
	/** Intrigents are attached for `serving_size`, for example if serving size would be 2 pills, and user ingested single pill we'll divide ingested intrigents. */
	ingredients: [MixtureIngredient]

	private constructor(properties: {
		id?: number
		name: string
		labeller?: string
		routeOfAdministration?: RouteOfAdministrationClassification
		form?: string
		serving_size?: Dosage
		ingredients: [MixtureIngredient]
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
		serving_size?: Dosage
		routeOfAdministration?: RouteOfAdministrationClassification
		form?: string
		ingredients: [MixtureIngredient]
	}): Mixture {
		return new Mixture(properties)
	}
}
