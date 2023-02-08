import { ExperienceStage } from '../experience-stage.js'

export interface ExperienceStageTableProperties {
	/** Start of experience which would include onset and comeup. */
	onset?: ExperienceStage
	/** Middle of experience which would include plateau and peak. */
	peak?: ExperienceStage
	/** Ending of experience which would include offset and aftereffects. */
	offset?: ExperienceStage
}

export class ExperienceStageTable implements ExperienceStageTableProperties {
	/** Start of experience which would include onset and comeup. */
	onset?: ExperienceStage
	/** Middle of experience which would include plateau and peak. */
	peak?: ExperienceStage
	/** Ending of experience which would include offset and aftereffects. */
	offset?: ExperienceStage

	constructor(properties: ExperienceStageTableProperties) {
		Object.assign(this, properties)
	}
}
