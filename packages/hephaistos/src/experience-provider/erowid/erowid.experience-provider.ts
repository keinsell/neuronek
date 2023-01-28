import dataset from 'erowid-dataset'
import { ExperienceReport } from 'osiris'
import { ErowidMapper } from './erowid.mapper.js'
import { PsychonautWikiSubstanceProvider } from '../../substance-provider/psychonautwiki/psychonautwiki.substance-provider.js'
import { SubstanceProviderAdapter } from '../../substance-provider/substance-provider.adapter.js'

export class ErowidExperienceProvider implements ErowidExperienceProvider {
	constructor(protected substanceProvider: SubstanceProviderAdapter = new PsychonautWikiSubstanceProvider()) {}

	async all(): Promise<ExperienceReport[]> {
		const experiences = []

		for (const experience of dataset) {
			const mappedExperience = await new ErowidMapper().ErowidExperience__ExperienceReport(experience)
			experiences.push(mappedExperience)
		}

		return experiences
	}
}
