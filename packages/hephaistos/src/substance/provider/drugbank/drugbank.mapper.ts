import { Substance } from 'osiris'
import { DrugElement } from 'drugbank-dataset'

export class DrugbankMapper {
	toDomain(payload: DrugElement): Substance {
		return Substance.create({
			name: payload.name
		})
	}
}
