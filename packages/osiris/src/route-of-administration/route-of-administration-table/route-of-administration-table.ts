import { RouteOfAdministrationClassification } from './route-of-administration-classification.js'
import { RouteOfAdministration } from '../route-of-administration.js'

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
	get all(): RouteOfAdministration[] {
		return Object.values(this).filter((route: RouteOfAdministration) => Boolean(route))
	}
}
