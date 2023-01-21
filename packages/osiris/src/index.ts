import { Osiris } from './osiris.js'
import { getSubstanceFromPsychonautWiki } from './providers/psychonautwiki/get-substance/get-substance.js'

const osiris = new Osiris()

export { DosageClassification } from './shared/dosage/dosage-classification.js'
export { RouteOfAdministrationClassification } from './shared/route-of-administration/route-of-administration-classification.js'

export default osiris
