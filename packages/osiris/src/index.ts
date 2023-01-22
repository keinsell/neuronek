import { Osiris } from './osiris.js'
import data from 'psyxts-dataset'

const osiris = new Osiris()

export { DosageClassification } from './shared/substance/route-of-administration-table/route-of-administration/dosage-table/dosage-classification.js'
export { RouteOfAdministrationClassification } from './shared/substance/route-of-administration-table/route-of-administration-classification.js'
export type { _SubstanceJSON } from './shared/substance/substance.js'

export default osiris
