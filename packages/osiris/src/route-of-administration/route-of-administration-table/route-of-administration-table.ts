import { RouteOfAdministrationClassification } from './route-of-administration-classification.js'
import { RouteOfAdministration, RouteOfAdministrationJSON } from '../route-of-administration.js'
import { type } from 'os'

export type RouteOfAdministrationTableProperties = {
	[classification in RouteOfAdministrationClassification]?: RouteOfAdministration
}

export type RouteOfAdministrationTableJSON = {
	[classification in RouteOfAdministrationClassification]?: RouteOfAdministrationJSON
}

export class RouteOfAdministrationTable implements RouteOfAdministrationTableProperties {
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

	constructor(properties: RouteOfAdministrationTableProperties) {
		Object.assign(this, properties)
	}

	/** Filters table of routes of administration and returns only documented routes. */
	get all(): RouteOfAdministration[] {
		return Object.values(this).filter((route: RouteOfAdministration) => Boolean(route))
	}

	toJSON(): RouteOfAdministrationTableJSON {
		const json: RouteOfAdministrationTableJSON = {}

		for (const key of Object.keys(RouteOfAdministrationClassification)) {
			const classification: RouteOfAdministrationClassification =
				RouteOfAdministrationClassification[key as RouteOfAdministrationClassification]

			if (this[classification]) {
				json[classification] = this[classification].toJSON()
			}
		}

		return json
	}

	static fromJSON(json: RouteOfAdministrationTableJSON): RouteOfAdministrationTable {
		const table = {}

		for (const key of Object.keys(json)) {
			table[key as RouteOfAdministrationClassification] = RouteOfAdministration?.fromJSON(json[key])
		}

		return new RouteOfAdministrationTable(table)
	}
}
