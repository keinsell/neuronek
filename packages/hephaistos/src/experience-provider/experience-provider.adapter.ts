import { ExperienceReport } from 'osiris'

export abstract class ExperienceProviderAdapter {
	abstract load(): Promise<ExperienceReport[]>
}
