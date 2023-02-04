import { ChemicalNomenclature, Substance } from 'osiris'
import { LocalStorageRepository } from 'src/__core/localstorage.js'

interface SubstanceWriteReadModel {
	name: string
	common_names?: string[]
}

export class SubstanceLocalStorage extends LocalStorageRepository<Substance, SubstanceWriteReadModel> {
	constructor(file = 'cache/substances.json') {
		super(file)
	}

	toDomain(storage: SubstanceWriteReadModel): Substance {
		return Substance.create({
			name: storage.name,
			nomenclature: ChemicalNomenclature.create({
				common_names: storage.common_names ?? []
			})
		})
	}

	toStorage(model: Substance): SubstanceWriteReadModel {
		return {
			name: model.name,
			common_names: model.nomenclature?.common_names ?? []
		}
	}

	async exists(model: Substance): Promise<boolean> {
		const find = this.low.data.find(effect => effect.name === model.name)

		return !!find
	}

	async getIndex(model: Substance): Promise<number> {
		const index = this.low.data.findIndex(effect => effect.name === model.name)

		if (index === -1) {
			return undefined
		}

		return index
	}
}
