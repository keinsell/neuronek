import { ValueObject } from '../__core/valueobject.js'
import { RouteOfAdministration } from './route-of-administration.js'
import { RouteOfAdministrationClassification } from './RouteOfAdministrationClassification.js'

export type RouteOfAdministrationTableProperties = {
	[classification in RouteOfAdministrationClassification]?: RouteOfAdministration
}

export class RouteOfAdministrationTable extends ValueObject<RouteOfAdministrationTableProperties> {
	public [RouteOfAdministrationClassification.oral]?: RouteOfAdministration
	public [RouteOfAdministrationClassification.sublingual]?: RouteOfAdministration
	public [RouteOfAdministrationClassification.buccal]?: RouteOfAdministration
	public [RouteOfAdministrationClassification.insufflated]?: RouteOfAdministration
	public [RouteOfAdministrationClassification.rectal]?: RouteOfAdministration
	public [RouteOfAdministrationClassification.transdermal]?: RouteOfAdministration
	public [RouteOfAdministrationClassification.subcutaneous]?: RouteOfAdministration
	public [RouteOfAdministrationClassification.intramuscular]?: RouteOfAdministration
	public [RouteOfAdministrationClassification.interavenous]?: RouteOfAdministration
	public [RouteOfAdministrationClassification.smoked]?: RouteOfAdministration

	static fromMultipleRoutesOfAdministration(...items: RouteOfAdministration[]): RouteOfAdministrationTable {
		const properties: Partial<RouteOfAdministrationTableProperties> = {}

		for (const route of items) {
			properties[route._v.classification] = route
		}

		return new RouteOfAdministrationTable(properties as RouteOfAdministrationTableProperties)
	}
}
