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

export const Coluracetam: Substance = new Substance(
	{
		name: "Coluracetam",
		chemnicalNomencalture: new ChemicalNomenclature({
			commonNames: ["Coluracetam", "BCI-540", "MKC-231"],
			substitutiveName:
				"N-(2,3-Dimethyl-5,6,7,8-tetrahydrofuro[2,3-b]quinolin-4-yl)-2-(2-oxo-1-pyrrolidinyl)acetamide",
			systematicName: "",
		}),
		classMembership: new ClassMembership({
			psychoactiveClass: PsychoactiveClass.nootropic,
			chemicalClass: "phenetylamine",
		}),
		administrationRoutes: [
			new RouteOfAdministration({
				route: RouteOfAdministrationType.oral,
				_substance: "Coluracetam",
				bioavailability: 0.8,
				dosage: {
					thereshold: 1,
					light: 3,
					moderate: 5,
					strong: 10,
					heavy: 20,
					overdose: 1000,
				},
				duration: {
					onset: ms("30m"),
					comeup: ms("1h"),
					peak: ms("2h"),
					offset: ms("2h"),
					aftereffects: ms("2h"),
				},
			}),
		],
		effects: [
			new EffectOccurance({
				effect: AnalysisEnhancement,
			}),
		],
	},
	"coluracetam",
);
