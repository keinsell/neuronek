import { RouteOfAdministrationClassification } from './route-of-administration-classification.js'
import { RouteOfAdministration, _RouteOfAdministrationJSON } from './route-of-administration/route-of-administration.js'

export type _RouteOfAdministrationTableJSON = {
	[route in RouteOfAdministrationClassification]?: _RouteOfAdministrationJSON
}

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

	constructor(routesOfAdministration: {
		[route in RouteOfAdministrationClassification]?: RouteOfAdministration
	}) {
		for (const route in routesOfAdministration) {
			this[route] = routesOfAdministration[route]
		}
	}

	/** Filters table of routes of administration and returns only documented routes. */
	getDocumentedRoutesOfAdministration(): RouteOfAdministration[] {
		return Object.values(this).filter((route: RouteOfAdministration) => !!route)
	}

	toJSON(): _RouteOfAdministrationTableJSON {
		const json: _RouteOfAdministrationTableJSON = {}

		for (const route in this) {
			const routeOfAdministration = this[route as RouteOfAdministrationClassification]
			if (routeOfAdministration) {
				json[route as RouteOfAdministrationClassification] = routeOfAdministration.toJSON()
			}
		}

		return json
	}

	static fromJSON(json: _RouteOfAdministrationTableJSON): RouteOfAdministrationTable {
		const routesOfAdministration: { [route in RouteOfAdministrationClassification]?: RouteOfAdministration } = {}

		for (const route in json) {
			routesOfAdministration[route] = json[route] ? RouteOfAdministration.fromJSON(json[route]) : undefined
		}

		return new RouteOfAdministrationTable(routesOfAdministration)
	}
}
