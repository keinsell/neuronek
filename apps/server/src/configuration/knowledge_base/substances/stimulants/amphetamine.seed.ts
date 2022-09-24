/* eslint-disable node/file-extension-in-import */
import ms from "ms";
import {
	EffectIntensivity,
	EffectOccurance,
} from "../../../../modules/substances/effect/entities/effect-occurance.entity";
import { ChemicalNomenclature } from "../../../../modules/substances/substance/entities/chemical-nomenclature";
import { ClassMembership } from "../../../../modules/substances/substance/entities/class-membership.entity";
import { DosageClassification } from "../../../../modules/substances/substance/entities/dosage.entity";
import { PsychoactiveClass } from "../../../../modules/substances/substance/entities/psychoactive-class.enum";
import {
	RouteOfAdministration,
	RouteOfAdministrationType,
} from "../../../../modules/substances/route-of-administration/entities/route-of-administration.entity";
import { Substance } from "../../../../modules/substances/substance/entities/substance.entity";
import { MotivationEnhancement } from "../../effects/cognitive/enhancements/motivation-enhancement.seed";
import { Stimulation } from "../../effects/physical/stimulation.seed";
import { MotivationSupression } from "../../effects/cognitive/supressions/motivation-suppression.seed";
import { PhaseType } from "../../../../modules/substances/substance/entities/phase.entity";
import { Anxiety } from "../../effects/cognitive/enhancements/anxiety.seed";
import { FocusEnhancement } from "../../effects/cognitive/enhancements/focus-enhancement/focus-enchancement";
import { SpontaneousBodilySensations } from "../../effects/tactile/spontaneous-bodily-sensations";
import { AnalysisEnhancement } from "../../effects/cognitive/enhancements/analysis-enhancement/analysis-enchancement";

export const Amphetamine: Substance = new Substance(
	{
		name: "Amphetamine",
		chemnicalNomencalture: new ChemicalNomenclature({
			commonNames: ["Amphetamine", "Speed", "Adderall", "Pep", "Fet"],
			substitutiveName: "α-Methylphenethylamine",
			systematicName: "(RS)-1-Phenylpropan-2-amine",
		}),
		classMembership: new ClassMembership({
			psychoactiveClass: PsychoactiveClass.stimulant,
			chemicalClass: "phenetylamine",
		}),
		administrationRoutes: [
			new RouteOfAdministration({
				route: RouteOfAdministrationType.insufflated,
				_substance: "Amphetamine",
				bioavailability: 0.8,
				dosage: {
					thereshold: 4,
					light: 6,
					moderate: 15,
					strong: 30,
					heavy: 50,
					overdose: 100,
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
				route: RouteOfAdministrationType.oral,
				_substance: "Amphetamine",
				bioavailability: 0.75,
				dosage: {
					thereshold: 2.5,
					light: 5,
					moderate: 10,
					strong: 25,
					heavy: 50,
					overdose: 100,
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
		effects: [
			new EffectOccurance({
				effect: AnalysisEnhancement,
				substance: "Amphetamine",
				dosages: [DosageClassification.light, DosageClassification.moderate],
				phases: [PhaseType.comeup, PhaseType.peak],
			}),
			new EffectOccurance({
				effect: MotivationEnhancement,
				substance: "Amphetamine",
				dosages: [
					DosageClassification.moderate,
					DosageClassification.strong,
					DosageClassification.heavy,
				],
				phases: [PhaseType.comeup, PhaseType.peak],
			}),
			new EffectOccurance({
				effect: FocusEnhancement,
				substance: "Amphetamine",
				dosages: [DosageClassification.light, DosageClassification.moderate],
				phases: [PhaseType.comeup, PhaseType.peak],
			}),
			new EffectOccurance({
				effect: Stimulation,
				substance: "Amphetamine",
				dosages: [
					DosageClassification.moderate,
					DosageClassification.strong,
					DosageClassification.heavy,
					DosageClassification.overdose,
				],
				phases: [PhaseType.onset, PhaseType.peak],
				intensivity: EffectIntensivity.moderate,
				description:
					"Amphetamine is reported to be very energetic and stimulating. It can encourage physical activities such as dancing, socializing, running, or cleaning. The particular style of stimulation that amphetamine produces can be described as forced. This means that at higher dosages, it becomes difficult or impossible to keep still. Jaw clenching, involuntary bodily shakes, and vibrations become present, resulting in extreme shaking of the entire body, unsteadiness of the hands, and a general loss of fine motor control. This is replaced with mild fatigue and general exhaustion during the offset of the experience.",
			}),
			new EffectOccurance({
				effect: MotivationSupression,
				substance: "Amphetamine",
				dosages: [
					DosageClassification.moderate,
					DosageClassification.strong,
					DosageClassification.heavy,
					DosageClassification.overdose,
				],
				phases: [PhaseType.offset, PhaseType.aftereffects],
				intensivity: EffectIntensivity.moderate,
				description:
					"Experiences can range from mild demotivation to extreme states of disinterest. This effect is more prominent at common and heavy doses.",
			}),
			new EffectOccurance({
				effect: SpontaneousBodilySensations,
				substance: "Amphetamine",
				phases: [PhaseType.onset, PhaseType.peak],
				// TODO: Not sure about this one, but according to experiences nobody experienced such at lower dosages, I would also doubt moderate dosage causes this effect.
				dosages: [
					DosageClassification.moderate,
					DosageClassification.strong,
					DosageClassification.heavy,
				],
				description: `The "body high" of amphetamine can be described as a moderate euphoric tingling sensation that encompasses the entire body. This sensation maintains a consistent presence that steadily rises with the onset and hits its limit once the peak has been reached.`,
			}),
			new EffectOccurance({
				effect: Anxiety,
				substance: "Amphetamine",
				phases: [PhaseType.offset, PhaseType.aftereffects],
				description:
					"Anxiety can reach severe levels during the comedown in some users.",
			}),
		],
	},
	"amphetamine",
);
