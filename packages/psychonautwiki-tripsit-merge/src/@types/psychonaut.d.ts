/* eslint-disable no-unused-vars */

export interface PwSubstance {
	name: string
	url: string
	featured: Boolean
	effects: [Effect]
	experiences: [Experience]
	class: SubstanceClass
	tolerance: SubstanceTolerance
	roa: SubstanceRoaTypes
	roas: [SubstanceRoa]
	summary: string
	images: [SubstanceImage]
	addictionPotential: string
	toxicity: [string]
	crossTolerances: [string]
	commonNames: [string]
	uncertainInteractions: [PwSubstance]
	unsafeInteractions: [PwSubstance]
	dangerousInteractions: [PwSubstance]
}

export type SubstanceClass = {
	chemical: [string]
	psychoactive: [string]
}

export type SubstanceTolerance = {
	full: string
	half: string
	zero: string
}

export interface RoaRange {
	min: number
	max: number
	units?: string
}

export type SubstanceRoaDose = {
	units: string
	threshold: number
	heavy: number
	common: RoaRange
	light: RoaRange
	strong: RoaRange
}

type SubstanceRoaDuration = {
	afterglow: RoaRange
	comeup: RoaRange
	duration: RoaRange
	offset: RoaRange
	onset: RoaRange
	peak: RoaRange
	total: RoaRange
}

type SubstanceRoa = {
	name: string
	dose: SubstanceRoaDose
	duration: SubstanceRoaDuration
	bioavailability: RoaRange
}

type SubstanceRoaTypes = {
	oral: SubstanceRoa
	sublingual: SubstanceRoa
	buccal: SubstanceRoa
	insufflated: SubstanceRoa
	rectal: SubstanceRoa
	transdermal: SubstanceRoa
	subcutaneous: SubstanceRoa
	intramuscular: SubstanceRoa
	intravenous: SubstanceRoa
	smoked: SubstanceRoa
}

type SubstanceImage = {
	thumb: string
	image: string
}

type Effect = {
	name: string
	url: string
	substances: [PwSubstance]
	experiences: [Experience]
}

type Experience = {
	substances: [PwSubstance]
	effects: [Experience]
}

type Query = {
	substances(
		effect: string,
		query: string,
		chemicalClass: string,
		psychoactiveClass: string,
		limit: number | 10,
		offset: number | 10
	): [PwSubstance]
	substances_by_effect(effect: [string], limit: number | 50, offset: number | 0): [PwSubstance]
	effects_by_substance(substance: string, limit: number | 50, offset: number | 0): [Effect]
	experiences(substances_by_effect: string, effects_by_substance: string, substance: string): [Experience]
}
