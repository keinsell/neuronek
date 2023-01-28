import { DosageUnit } from '../dosage-unit/dosage-unit'

/** Toxicity Table represents data related to individual toxicity of given substance, such entity provides information about lethal and potentially harmful dosages that are known for given substance. */
export class ToxicityTable {
	ld50PerKilogram?: DosageUnit
	description?: string

	constructor(payload: { ld50PerKilogram?: DosageUnit; description?: string }) {
		this.ld50PerKilogram = payload.ld50PerKilogram
		this.description = payload.description
	}
}
