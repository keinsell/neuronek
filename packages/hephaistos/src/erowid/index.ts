import dataset from 'erowid-dataset'

export function findErowidExpericesWithOneOfCommonNamesMentioned(commonNames: string[]) {
	const experiencesWithCommonNamesMentioned = []

	for (const experience of dataset) {
		const { dose } = experience

		if (!dose) {
			continue
		}

		dose.forEach(dosage => {
			console.log(dose)

			const { substance } = dosage

			if (commonNames.includes(substance)) {
				experiencesWithCommonNamesMentioned.push(experience)
			}
		})
	}

	return experiencesWithCommonNamesMentioned
}
