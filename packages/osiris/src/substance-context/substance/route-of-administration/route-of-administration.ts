import { Entity } from '../../../common/entity/entity.js'
import { DosageTable } from '../dosage-table/dosage-table.js'
import { PhaseTable } from '../phase-table/phase-table.js'
import { Bioavailability } from './bioavailability/bioavailability.js'
import { RouteOfAdministrationClassification } from './route-of-administration-classification.js'

export interface RouteOfAdministrationProperties {
	readonly classification: RouteOfAdministrationClassification
	readonly bioavailability?: Bioavailability | undefined
	readonly dosage: DosageTable
	readonly phase: PhaseTable
	readonly _substance: string
}

/**
 * Routes of administration refer to the different ways in which a chemical compound or a drug can be taken into the body.
 */
export class RouteOfAdministration extends Entity<RouteOfAdministrationProperties> {
	constructor(properties: RouteOfAdministrationProperties, id?: string) {
		super(properties, id)
	}

	public toJSON(): RouteOfAdministrationProperties {
		return {
			...this.properties
		}
	}

	public static fromJSON(json: RouteOfAdministrationProperties): RouteOfAdministration {
		return new RouteOfAdministration({
			...json
		})
	}
}
