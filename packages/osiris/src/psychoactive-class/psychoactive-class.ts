import { PsychoactiveClassification } from './PsychoactiveClassification'

export interface PsychoactiveClassProperties {
	/**
	 * The name of the class
	 * @type PsychoactiveClassification
	 * @example 'psychedelic'
	 */
	name: PsychoactiveClassification
	/**
	 * The type of effect produced by the class
	 * @type string
	 * @example 'Psychedelics (also known as serotonergic hallucinogens) are a class of psychoactive substances that produce an altered state of consciousness marked by unusual changes in perception, mood, and cognitive processes.'
	 */
	description?: string
	wikipedia?: string
	psychonautwiki?: string
}

export class PsychoactiveClass implements PsychoactiveClassProperties {
	name: PsychoactiveClassification
	description?: string
	wikipedia?: string
	psychonautwiki?: string

	constructor(properties: PsychoactiveClassProperties) {
		Object.assign(this, properties)
	}
}

export const _PsychoactiveClassificationData: { [key in PsychoactiveClassification]: PsychoactiveClass } = {
	[PsychoactiveClassification.psychedelic]: new PsychoactiveClass({
		name: PsychoactiveClassification.psychedelic,
		description: `Psychedelics (also known as serotonergic hallucinogens) are a class of psychoactive substances that produce an altered state of consciousness marked by unusual changes in perception, mood, and cognitive processes.`
	}),
	[PsychoactiveClassification.stimulant]: new PsychoactiveClass({
		name: PsychoactiveClassification.stimulant,
		description: `Stimulants are a class of psychoactive substances that increases activity in the brain through the raising of neurotransmission levels, stimulating or increasing arousal/stimulation in various areas of the brain.`
	}),
	[PsychoactiveClassification.depressant]: new PsychoactiveClass({
		name: PsychoactiveClassification.depressant,
		description: `Depressants are a class of psychoactive substances that produce a sedative state, a general reduction in tension and anxiety, a decrease in the psychological perception of pain, and an overall general slowing of the nervous system.`
	}),
	[PsychoactiveClassification.dissociative]: new PsychoactiveClass({
		name: PsychoactiveClassification.dissociative,
		description: `Dissociatives are a class of psychoactive substances that produce a dissociative state, a reduced sense of self, an altered sense of time, and a numbness to emotional response.`
	}),
	[PsychoactiveClassification.deliriant]: new PsychoactiveClass({
		name: PsychoactiveClassification.deliriant,
		description: `Deliriants are a class of psychoactive substances that produce a delirious state, characterized by disturbed or disorganized thought processes, hallucinations, and/or delusions.`
	}),
	[PsychoactiveClassification.nootropic]: new PsychoactiveClass({
		name: PsychoactiveClassification.nootropic,
		description: `Nootropics are a class of psychoactive substances that are used to improve cognitive function, particularly executive functions, memory, creativity, or motivation, in healthy individuals.`
	}),
	[PsychoactiveClassification.antidepressant]: new PsychoactiveClass({
		name: PsychoactiveClassification.antidepressant,
		description: `Antidepressants are a class of psychoactive substances that are used to treat major depressive disorders, including major depressive disorder, dysthymia, and seasonal affective disorder.`
	}),
	[PsychoactiveClassification.empathogen]: new PsychoactiveClass({
		name: PsychoactiveClassification.empathogen,
		description: `Empathogens are a class of psychoactive substances that produce an empathogenic effect or empathogenic state, characterized by increased empathy, social connectedness, and/or emotional warmth.`
	}),
	[PsychoactiveClassification.entheogen]: new PsychoactiveClass({
		name: PsychoactiveClassification.entheogen,
		description: `Entheogens (from the Ancient Greek ἔνθεος entheos ["god", "divine"] and γενέσθαι genesthai ["generate" - "generating the divine within"]) are a family of psychoactive substances, typically of plant origin, that are used in religious, ritual, or spiritual contexts. Jonathan Ott is credited with coining the term in 1979.`
	})
}
