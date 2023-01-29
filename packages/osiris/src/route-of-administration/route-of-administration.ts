import { DosageTable, DosageTableJSON } from '../dosage/dosage-table/dosage-table.js'
import { PhaseTable, PhaseTableJSON } from '../phase/phase-table/phase-table.js'

export interface RouteOfAdministrationProperties {
	readonly bioavailability?: number
	readonly dosage: DosageTable
	readonly phase: PhaseTable
}

export interface RouteOfAdministrationJSON {
	readonly bioavailability?: number
	readonly dosage: DosageTableJSON
	readonly phase: PhaseTableJSON
}

export class RouteOfAdministration implements RouteOfAdministrationProperties {
	public readonly bioavailability?: number
	public readonly dosage: DosageTable
	public readonly phase: PhaseTable

	constructor(properties: RouteOfAdministrationProperties) {
		Object.assign(this, properties)
	}

	public toJSON(): RouteOfAdministrationJSON {
		return {
			bioavailability: this.bioavailability,
			dosage: this.dosage.toJSON(),
			phase: this.phase.toJSON()
		}
	}

	public static fromJSON(json: RouteOfAdministrationJSON): RouteOfAdministration {
		return new RouteOfAdministration({
			...json,
			dosage: DosageTable.fromJSON(json.dosage),
			phase: PhaseTable.fromJSON(json.phase)
		})
	}
}
