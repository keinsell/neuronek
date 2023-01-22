import { Osiris } from './osiris.js'
import { getSubstanceFromPsychonautWiki } from './providers/psychonautwiki/get-substance/get-substance.js'

const osiris = new Osiris()

export { DosageClassification } from './shared/substance/route-of-administration-table/route-of-administration/dosage-table/dosage-classification.js'
export { RouteOfAdministrationClassification } from './shared/substance/route-of-administration-table/route-of-administration-classification.js'
export type { _SubstanceJSON } from './shared/substance/substance.js'

export default osiris
