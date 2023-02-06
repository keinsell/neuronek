import { Dosage } from '../dosage/dosage.js'
import { Mixture } from '../mixtures/mixture.model.js'
import { Substance } from '../substance/substance.js'

export class Possesion {
	of: Substance | Mixture
	quantity: number
}
