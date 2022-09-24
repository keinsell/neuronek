import ms from "ms";
import { ChemicalNomenclature } from "../../../../modules/substances/substance/entities/chemical-nomenclature";
import { ClassMembership } from "../../../../modules/substances/substance/entities/class-membership.entity";
import { PsychoactiveClass } from "../../../../modules/substances/substance/entities/psychoactive-class.enum";
import {
	RouteOfAdministration,
	RouteOfAdministrationType,
} from "../../../../modules/substances/route-of-administration/entities/route-of-administration.entity";
import { Substance } from "../../../../modules/substances/substance/entities/substance.entity";

export const Caffeine: Substance = new Substance(
	{
		name: "Caffeine",
		chemnicalNomencalture: new ChemicalNomenclature({
			commonNames: ["Caffeine", "Coffee"],
			substitutiveName: "1,3,7-Trimethylxanthine",
			systematicName: "1,3,7-Trimethylpurine-2,6-dione",
		}),
		classMembership: new ClassMembership({
			psychoactiveClass: PsychoactiveClass.stimulant,
			chemicalClass: "xanthine",
		}),
		administrationRoutes: [
			new RouteOfAdministration({
				route: RouteOfAdministrationType.oral,
				_substance: "Caffeine",
				bioavailability: 0.8,
				dosage: {
					thereshold: 10,
					light: 20,
					moderate: 50,
					strong: 150,
					heavy: 500,
					overdose: 1000,
				},
				duration: {
					onset: ms("10m"),
					comeup: ms("60m"),
					peak: ms("2h"),
					offset: ms("10h"),
					aftereffects: ms("4h"),
				},
			}),
		],
		effects: [],
	},
	"caffeine",
);
