export interface ToxicityTableProperties {
	ld50?: string
	description?: string
}

/** Toxicity Table represents data related to individual toxicity of given substance, such entity provides information about lethal and potentially harmful dosages that are known for given substance. */
export class ToxicityTables {
	ld50?: string
	description?: string

	private constructor(payload: ToxicityTableProperties) {
		Object.assign(this, payload)
	}

	static async create(payload: ToxicityTableProperties): Promise<ToxicityTables> {
		return new ToxicityTables(payload)
	}
}
