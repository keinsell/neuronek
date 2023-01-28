export enum PsychoactiveClassification {
	/** Psychedelics (also known as serotonergic hallucinogens) are a class of psychoactive substances that produce an altered state of consciousness marked by unusual changes in perception, mood, and cognitive processes. */
	psychedelic = 'psychedelic',
	/** Stimulants (also known as psychostimulants; colloquially as "uppers") are a major class of psychoactive substances that increase activity of the nervous system to promote alertness, arousal, and motor activity. */
	stimulant = 'stimulant',
	/** Depressants (also known as sedatives and informally as "downers") are a major class of psychoactive substances that decreases activity in the brain through the lowering of neurotransmission levels, depressing or reducing arousal/stimulation in various areas of the brain. */
	depressant = 'depressant',
	/** Dissociatives (also referred to as dissociative anesthetics) are a class of hallucinogen. Members of this class are characterized by distorted sensory perceptions and feelings of disconnection or detachment from the environment and self. The phenomenology is often described in terms of reducing or blocking signals to the conscious mind from other parts of the central nervous system. */
	dissociative = 'dissociative',
	/** Deliriants are a subclass of hallucinogens. They display a unique property in that they easily produce solid hallucinations which integrate seamlessly into waking consciousness, similar to fully formed dreams or delusions. In contrast, classical psychedelics and dissociatives have progressive levels of multiple all-encompassing sensory effects before reaching the level of concrete hallucination. */
	deliriant = 'deliriant',
	/** Nootropics (also referred to as smart drugs, neuro enhancers, and cognitive enhancers) are substances that purportedly improve cognitive functions such as memory, motivation, attention, and concentration, in healthy individuals. Nootropics are thought to work by altering the availability of the brain's supply of neurochemicals (i.e. neurotransmitters, enzymes, and hormones), by improving the brain's oxygen supply, or by stimulating nerve growth. */
	nootropic = 'nootropic',
	/** Antidepressants are a class of psychoactive substances that are prescribed to treat psychiatric disorders, most commonly major depressive disorder and some forms of anxiety disorders. Antidepressants are thought to work by increasing levels of certain neurotransmitters, such as dopamine, serotonin, and/or norepinephrine in certain regions in the brain.*/
	antidepressant = 'antidepressant',
	/** Entactogens (also known as empathogens) are a class of psychoactive substances that produce distinctive emotional and social effects similar to those of MDMA. The term "empathogen" was coined in 1983 by Ralph Metzner to denote chemical agents capable of inducing feelings of empathy. "Entactogen" was coined by David E. Nichols as an alternative to "empathogen," attempting to avoid the potential for an improper association of the latter with negative connotations related to the Greek root "pathos" (suffering). */
	empathogen = 'empathogen',
	/** Entheogens (from the Ancient Greek ἔνθεος entheos ["god", "divine"] and γενέσθαι genesthai ["generate" - "generating the divine within"]) are a family of psychoactive substances, typically of plant origin, that are used in religious, ritual, or spiritual contexts. Jonathan Ott is credited with coining the term in 1979. */
	entheogen = 'entheogen'
}

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
