import { ExperienceReport } from 'osiris'

export abstract class ExperienceProviderAdapter {
	abstract all(): Promise<ExperienceReport[]>
}
