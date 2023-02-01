import dataset from 'erowid-dataset'
import { Dosage, ExperienceReport, Ingestion } from 'osiris'
import { SubstanceCacheManager } from 'src/substance-provider/substance.cache-manager.js'

import { ExperienceCacheManager } from '../experience.cache-manager.js'

import type { Report } from 'erowid-dataset'
export class ErowidExperienceProvider implements ErowidExperienceProvider {
	constructor(
		protected substanceCacheManager: SubstanceCacheManager = new SubstanceCacheManager(),
		protected experienceCacheManager: ExperienceCacheManager = new ExperienceCacheManager()
	) {}

	private async ErowirdReport__ExperienceReport(input: Report): Promise<ExperienceReport> {
		const dosages = input.dose as any

		const ingestions: Ingestion[] = []

		// Extract ingestions from Erowid dataset.
		for (const dose of dosages) {
			const substance = await this.substanceCacheManager.findByName(dose.substance)

			if (!substance) {
				continue
			}

			let dosage: Dosage | null

			if (dose.amount) {
				if (dose.amount.unit && dose.amount.quantity) {
					try {
						dosage = new Dosage(dose.amount.quantity, dose.amount.unit)
					} catch (error) {
						console.warn(`Error while creating ingestion for ${input.title}.`)
					}
				}
			}

			if (!dosage) {
				dosage = null
				continue
			}

			const ingestion = new Ingestion({
				substance: substance,
				dosage: dosage
			})

			ingestions.push(ingestion)
		}

		return new ExperienceReport({
			title: input.title,
			submissionDate: new Date(input.date.submission),
			experienceDate: new Date(input.date.experience),
			ingestions: ingestions,
			raw_content: input.report
		})
	}

	async load(): Promise<ExperienceReport[]> {
		const experiences = []

		console.log(`Importing ${dataset.length} Erowid reports...`)

		let index = 1

		for (const experience of dataset) {
			console.log(`Importing Erowid experience ${experience.title}... ${index}/${dataset.length}`)
			const mappedExperience = await this.ErowirdReport__ExperienceReport(experience)
			experiences.push(mappedExperience)
			index++
		}

		for (const experience of experiences) {
			await this.experienceCacheManager.save(experience)
		}

		return experiences
	}
}
