import dataset from 'erowid-dataset'
import { ExperienceReport } from 'osiris'

import type { Report } from 'erowid-dataset'
export class ErowidExperienceProvider implements ErowidExperienceProvider {
	async load(): Promise<ExperienceReport[]> {
		const experiences = []

		console.log(`Importing ${dataset.length} Erowid reports...`)

		return experiences
	}
}
