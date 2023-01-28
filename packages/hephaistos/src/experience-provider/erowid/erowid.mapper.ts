import { ExperienceReport } from 'osiris'
import type { Author, DoseEntity, Report } from 'erowid-dataset'
import { SubstanceProviderAdapter } from '../../substance-provider/substance-provider.adapter.js'
import { PsychonautWikiSubstanceProvider } from '../../substance-provider/psychonautwiki/psychonautwiki.substance-provider.js'

export class ErowidMapper {
	private async DoseEntity__Ingestion(
		input: DoseEntity[],
		substanceProvider: SubstanceProviderAdapter = new PsychonautWikiSubstanceProvider()
	) {}

	private Author__Subject(input: Author) {}

	public async ErowidExperience__ExperienceReport(input: Report): Promise<ExperienceReport> {
		return new ExperienceReport({
			title: input.title,
			submissionDate: new Date(input.date.submission),
			experienceDate: new Date(input.date.experience),
			raw_content: input.report
		})
	}
}
