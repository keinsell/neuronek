/* eslint-disable node/file-extension-in-import */
import ms from "ms";
import { Substance } from "../../../../modules/substance/entity";
import { PsychoactiveClass } from "../../../../modules/substance/entities/psychoactive-class.enum";
import { RouteOfAdministration } from "../../../../modules/substance/entities/route-of-administration.entity";
import { RouteOfAdministrationClassification } from "../../../../modules/substance/entities/route-of-administration-classification.enum";

export const Amphetamine: Substance = new Substance({
	name: "Amphetamine",
	description:
		"A very popular CNS stimulant available on prescription and black markets. Recreational in high doses, producing mild euphoria and an abundance of energy. Popular in eastern europe and the US.",
	chemicalNomencalture: {
		common: ["Amphetamine", "Speed", "Adderall", "Pep", "Fet"],
		substitutive: "α-Methylphenethylamine",
		systematic: "(RS)-1-Phenylpropan-2-amine",
	},
	psychoactiveClass: PsychoactiveClass.stimulant,
	chemicalClass: "phenetylamine",
	administrationBy: [
		new RouteOfAdministration({
			classification: RouteOfAdministrationClassification.insufflated,
			bioavailability: 0.8,
			dosage: {
				thereshold: 4000,
				light: 6000,
				moderate: 15000,
				strong: 30000,
				heavy: 50000,
				overdose: 100000,
			},
			duration: {
				onset: ms("5m"),
				comeup: ms("90m"),
				peak: ms("2h"),
				offset: ms("3h"),
				aftereffects: ms("4h"),
			},
		}),
		new RouteOfAdministration({
			classification: RouteOfAdministrationClassification.oral,
			bioavailability: 0.8,
			dosage: {
				thereshold: 2500,
				light: 5000,
				moderate: 15000,
				strong: 30000,
				heavy: 50000,
				overdose: 100000,
			},
			duration: {
				onset: ms("45m"),
				comeup: ms("135m"),
				peak: ms("4h"),
				offset: ms("3h"),
				aftereffects: ms("6h"),
			},
		}),
	],
});

// export const Amphetamine: Substance = new Substance(
// 	{
// 		name: "Amphetamine",
// 		chemnicalNomencalture: new ChemicalNomenclature({
// 			commonNames: ["Amphetamine", "Speed", "Adderall", "Pep", "Fet"],
// 			substitutiveName: "α-Methylphenethylamine",
// 			systematicName: "(RS)-1-Phenylpropan-2-amine",
// 		}),
// 		classMembership: new ClassMembership({
// 			psychoactiveClass: PsychoactiveClass.stimulant,
// 			chemicalClass: "phenetylamine",
// 		}),
// 		administrationRoutes: [
// 			new RouteOfAdministration({
// 				route: RouteOfAdministrationType.insufflated,
// 				_substance: "Amphetamine",
// 				bioavailability: 0.8,
// 				dosage: {
// 					thereshold: 4,
// 					light: 6,
// 					moderate: 15,
// 					strong: 30,
// 					heavy: 50,
// 					overdose: 100,
// 				},
// 				duration: {
// 					onset: ms("5m"),
// 					comeup: ms("90m"),
// 					peak: ms("2h"),
// 					offset: ms("3h"),
// 					aftereffects: ms("4h"),
// 				},
// 			}),
// 			new RouteOfAdministration({
// 				route: RouteOfAdministrationType.oral,
// 				_substance: "Amphetamine",
// 				bioavailability: 0.75,
// 				dosage: {
// 					thereshold: 2.5,
// 					light: 5,
// 					moderate: 10,
// 					strong: 25,
// 					heavy: 50,
// 					overdose: 100,
// 				},
// 				duration: {
// 					onset: ms("45m"),
// 					comeup: ms("135m"),
// 					peak: ms("4h"),
// 					offset: ms("3h"),
// 					aftereffects: ms("6h"),
// 				},
// 			}),
// 		],
// 		effects: [
// 			new EffectOccurance({
// 				effect: AnalysisEnhancement,
// 				substance: "Amphetamine",
// 				dosages: [
// 					DosageClassification.light,
// 					DosageClassification.moderate,
// 				],
// 				phases: [PhaseType.comeup, PhaseType.peak],
// 			}),
// 			new EffectOccurance({
// 				effect: MotivationEnhancement,
// 				substance: "Amphetamine",
// 				dosages: [
// 					DosageClassification.moderate,
// 					DosageClassification.strong,
// 					DosageClassification.heavy,
// 				],
// 				phases: [PhaseType.comeup, PhaseType.peak],
// 			}),
// 			new EffectOccurance({
// 				effect: FocusEnhancement,
// 				substance: "Amphetamine",
// 				dosages: [
// 					DosageClassification.light,
// 					DosageClassification.moderate,
// 				],
// 				phases: [PhaseType.comeup, PhaseType.peak],
// 			}),
// 			new EffectOccurance({
// 				effect: Stimulation,
// 				substance: "Amphetamine",
// 				dosages: [
// 					DosageClassification.moderate,
// 					DosageClassification.strong,
// 					DosageClassification.heavy,
// 					DosageClassification.overdose,
// 				],
// 				phases: [PhaseType.onset, PhaseType.peak],
// 				intensivity: EffectIntensivity.moderate,
// 				description:
// 					"Amphetamine is reported to be very energetic and stimulating. It can encourage physical activities such as dancing, socializing, running, or cleaning. The particular style of stimulation that amphetamine produces can be described as forced. This means that at higher dosages, it becomes difficult or impossible to keep still. Jaw clenching, involuntary bodily shakes, and vibrations become present, resulting in extreme shaking of the entire body, unsteadiness of the hands, and a general loss of fine motor control. This is replaced with mild fatigue and general exhaustion during the offset of the experience.",
// 			}),
// 			new EffectOccurance({
// 				effect: MotivationSupression,
// 				substance: "Amphetamine",
// 				dosages: [
// 					DosageClassification.moderate,
// 					DosageClassification.strong,
// 					DosageClassification.heavy,
// 					DosageClassification.overdose,
// 				],
// 				phases: [PhaseType.offset, PhaseType.aftereffects],
// 				intensivity: EffectIntensivity.moderate,
// 				description:
// 					"Experiences can range from mild demotivation to extreme states of disinterest. This effect is more prominent at common and heavy doses.",
// 			}),
// 			new EffectOccurance({
// 				effect: SpontaneousBodilySensations,
// 				substance: "Amphetamine",
// 				phases: [PhaseType.onset, PhaseType.peak],
// 				// TODO: Not sure about this one, but according to experiences nobody experienced such at lower dosages, I would also doubt moderate dosage causes this effect.
// 				dosages: [
// 					DosageClassification.moderate,
// 					DosageClassification.strong,
// 					DosageClassification.heavy,
// 				],
// 				description: `The "body high" of amphetamine can be described as a moderate euphoric tingling sensation that encompasses the entire body. This sensation maintains a consistent presence that steadily rises with the onset and hits its limit once the peak has been reached.`,
// 			}),
// 			new EffectOccurance({
// 				effect: Anxiety,
// 				substance: "Amphetamine",
// 				phases: [PhaseType.offset, PhaseType.aftereffects],
// 				description:
// 					"Anxiety can reach severe levels during the comedown in some users.",
// 			}),
// 		],
// 	},
// 	"amphetamine"
// );
