import { RouteOfAdministration } from '../../context.route-of-administration/route-of-administration.js'
import { RouteOfAdministrationClassification } from './RouteOfAdministrationClassification.js'

import type { Writable } from 'type-fest'

export class RouteOfAdministrationTable {
	public readonly [RouteOfAdministrationClassification.oral]?: RouteOfAdministration
	public readonly [RouteOfAdministrationClassification.sublingual]?: RouteOfAdministration
	public readonly [RouteOfAdministrationClassification.buccal]?: RouteOfAdministration
	public readonly [RouteOfAdministrationClassification.insufflated]?: RouteOfAdministration
	public readonly [RouteOfAdministrationClassification.rectal]?: RouteOfAdministration
	public readonly [RouteOfAdministrationClassification.transdermal]?: RouteOfAdministration
	public readonly [RouteOfAdministrationClassification.subcutaneous]?: RouteOfAdministration
	public readonly [RouteOfAdministrationClassification.intramuscular]?: RouteOfAdministration
	public readonly [RouteOfAdministrationClassification.interavenous]?: RouteOfAdministration
	public readonly [RouteOfAdministrationClassification.smoked]?: RouteOfAdministration

	private constructor(properties: {
		[classification in RouteOfAdministrationClassification]?: RouteOfAdministration
	}) {
		Object.assign(this, properties)
	}

	static fromMultipleRoutesOfAdministration(...items: RouteOfAdministration[]): RouteOfAdministrationTable {
		const properties: Writable<Partial<RouteOfAdministrationTable>> = {}

		for (const route of items) {
			properties[route.classification] = route
		}

		return new RouteOfAdministrationTable(properties)
	}
}
