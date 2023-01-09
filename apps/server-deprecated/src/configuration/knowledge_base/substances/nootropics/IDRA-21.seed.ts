import ms from "ms";
import { EffectOccurance } from "../../../../modules/substances/effect/entities/effect-occurance.entity";
import { ChemicalNomenclature } from "../../../../modules/substances/substance/entities/chemical-nomenclature";
import { ClassMembership } from "../../../../modules/substances/substance/entities/class-membership.entity";
import { PsychoactiveClass } from "../../../../modules/substances/substance/entities/psychoactive-class.enum";
import {
	RouteOfAdministration,
	RouteOfAdministrationType,
} from "../../../../modules/substances/route-of-administration/entities/route-of-administration.entity";
import { Substance } from "../../../../modules/substances/substance/entities/substance.entity";
import { AnalysisEnhancement } from "../../effects/cognitive/enhancements/analysis-enhancement/analysis-enchancement";

export const IDRA_21: Substance = new Substance(
	{
		name: "IDRA-21",
		chemnicalNomencalture: new ChemicalNomenclature({
			commonNames: ["IDRA-21"],
			substitutiveName: "",
			systematicName:
				"7-chloro-3-methyl-3,4-dihydro-2H-1λ6,2,4-benzothiadiazine 1,1-dioxide",
		}),
		classMembership: new ClassMembership({
			psychoactiveClass: PsychoactiveClass.nootropic,
			chemicalClass: "phenetylamine",
		}),
		administrationRoutes: [
			new RouteOfAdministration({
				route: RouteOfAdministrationType.oral,
				_substance: "IDRA-21",
				bioavailability: 0.8,
				dosage: {
					thereshold: 1,
					light: 3,
					moderate: 5,
					strong: 15,
					heavy: 25,
					overdose: 1000,
				},
				duration: {
					onset: ms("30m"),
					comeup: ms("1h"),
					peak: ms("2h"),
					offset: ms("4h"),
					aftereffects: ms("20h"),
				},
			}),
		],
		effects: [new EffectOccurance({ effect: AnalysisEnhancement })],
	},
	"coluracetam",
);
