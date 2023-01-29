import { Dosage } from '../dosage/dosage'

export interface ToxicityTableProperties {
	ld50?: Dosage
	description?: string
}

/** Toxicity Table represents data related to individual toxicity of given substance, such entity provides information about lethal and potentially harmful dosages that are known for given substance. */
export class ToxicityTable implements ToxicityTableProperties {
	ld50?: Dosage
	description?: string

	constructor(payload: ToxicityTableProperties) {
		Object.assign(this, payload)
	}
}
