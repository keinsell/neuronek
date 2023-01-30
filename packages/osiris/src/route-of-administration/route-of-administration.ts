import { Bioavailability, BioavailabilityJSON } from '../bioavailability/bioavailability.js'
import { DosageTable, DosageTableJSON } from '../dosage/dosage-table/dosage-table.js'
import { PhaseTable, PhaseTableJSON } from '../phase/phase-table/phase-table.js'
import { RouteOfAdministrationClassification } from './route-of-administration-table/route-of-administration-classification.js'

export interface RouteOfAdministrationProperties {
	readonly classification?: RouteOfAdministrationClassification | undefined
	readonly bioavailability?: Bioavailability | undefined
	readonly dosage: DosageTable
	readonly phase: PhaseTable
}

export interface RouteOfAdministrationJSON {
	readonly bioavailability?: BioavailabilityJSON | undefined
	readonly dosage: DosageTableJSON
	readonly phase: PhaseTableJSON
}

export class RouteOfAdministration implements RouteOfAdministrationProperties {
	classification?: RouteOfAdministrationClassification | undefined
	public readonly bioavailability?: Bioavailability | undefined
	public readonly dosage: DosageTable
	public readonly phase: PhaseTable

	constructor(properties: RouteOfAdministrationProperties) {
		this.bioavailability = properties.bioavailability
		this.dosage = properties.dosage
		this.phase = properties.phase
	}

	public toJSON(): RouteOfAdministrationJSON {
		return {
			bioavailability: this.bioavailability ? this.bioavailability.toJSON() : undefined,
			dosage: this.dosage.toJSON(),
			phase: this.phase.toJSON()
		}
	}

	public static fromJSON(json: RouteOfAdministrationJSON): RouteOfAdministration {
		return new RouteOfAdministration({
			bioavailability: json.bioavailability ? Bioavailability.fromJSON(json.bioavailability) : undefined,
			dosage: DosageTable.fromJSON(json.dosage),
			phase: PhaseTable.fromJSON(json.phase)
		})
	}
}
