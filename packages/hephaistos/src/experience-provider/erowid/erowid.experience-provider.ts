import dataset from 'erowid-dataset'
import type { Report } from 'erowid-dataset'
import { ExperienceReport } from 'osiris'
import { PsychonautWikiSubstanceProvider } from '../../substance-provider/psychonautwiki/psychonautwiki.substance-provider.js'
import { SubstanceProviderAdapter } from '../../substance-provider/substance-provider.adapter.js'
import { Ingestion, Substance } from 'osiris'

export class ErowidExperienceProvider implements ErowidExperienceProvider {
	constructor(protected substanceProvider: SubstanceProviderAdapter = new PsychonautWikiSubstanceProvider()) {}

	private async ErowirdReport__ExperienceReport(input: Report): Promise<ExperienceReport> {
		const dosages = input.dose

		const ingestions: Ingestion[] = []

		for await (const dosage of dosages) {
			let substance: Substance | undefined

			try {
				// substance = await this.substanceProvider.findSubstanceByName(dosage.substance)
			} catch (error) {
				console.log(error)
			}

			ingestions.push(
				new Ingestion({
					substance: substance
				})
			)
		}

		return new ExperienceReport({
			title: input.title,
			submissionDate: new Date(input.date.submission),
			experienceDate: new Date(input.date.experience),
			ingestions: ingestions,
			raw_content: input.report
		})
	}

	async all(): Promise<ExperienceReport[]> {
		const experiences = []

		console.log(`Importing ${dataset.length} Erowid reports...`)

		let index = 1

		for (const experience of dataset) {
			console.log(`Importing Erowid experience ${experience.title}... ${index}/${dataset.length}`)
			const mappedExperience = await this.ErowirdReport__ExperienceReport(experience)
			experiences.push(mappedExperience)
			index++
		}

		return experiences
	}
}
