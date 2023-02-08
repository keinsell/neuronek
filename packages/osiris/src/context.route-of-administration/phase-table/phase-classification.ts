export enum PhaseClassification {
	/** The onset phase can be defined as the period until the very first changes in perception (i.e. "first alerts") are able to be detected. */
	onset = 'onset',
	/** The "come up" phase can be defined as the period between the first noticeable changes in perception and the point of highest subjective intensity. This is colloquially known as "coming up." */
	comeup = 'comeup',
	/** The peak phase can be defined as period of time in which the intensity of the substance's effects are at its height. */
	peak = 'peak',
	/** The offset phase can be defined as the amount of time in between the conclusion of the peak and shifting into a sober state. This is colloquially referred to as "coming down." */
	offset = 'offset',
	/**
	 * The after effects can be defined as any residual effects which may remain after the experience has reached its conclusion. This is colloquially known as a "hangover" or an "afterglow" depending on the substance and usage.
	 */
	aftereffects = 'aftereffects'
}

export const _PhaseClassificationDescription: {
	[key in PhaseClassification]: string
} = {
	[PhaseClassification.onset]:
		'The onset phase can be defined as the period until the very first changes in perception (i.e. "first alerts") are able to be detected.',
	[PhaseClassification.comeup]:
		'The "come up" phase can be defined as the period between the first noticeable changes in perception and the point of highest subjective intensity. This is colloquially known as "coming up."',
	[PhaseClassification.peak]:
		"The peak phase can be defined as period of time in which the intensity of the substance's effects are at its height.",
	[PhaseClassification.offset]:
		'The offset phase can be defined as the amount of time in between the conclusion of the peak and shifting into a sober state. This is colloquially referred to as "coming down."',
	[PhaseClassification.aftereffects]:
		'The after effects can be defined as any residual effects which may remain after the experience has reached its conclusion. This is colloquially known as a "hangover" or an "afterglow" depending on the substance and usage.'
}
