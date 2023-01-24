import { findErowidExpericesWithOneOfCommonNamesMentioned } from './erowid/index.js'
import { getSubstanceFromPsychonautWiki } from './psychonautwiki/get-substance/get-substance.js'
import dataset from 'erowid-dataset'

console.log(await getSubstanceFromPsychonautWiki('LSD'))

console.log(findErowidExpericesWithOneOfCommonNamesMentioned(['LSD']))
