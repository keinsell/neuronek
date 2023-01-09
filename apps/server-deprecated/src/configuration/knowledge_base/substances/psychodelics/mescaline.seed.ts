import ms from "ms";
import { ChemicalNomenclature } from "../../../../modules/substances/substance/entities/chemical-nomenclature";
import { ClassMembership } from "../../../../modules/substances/substance/entities/class-membership.entity";
import { PsychoactiveClass } from "../../../../modules/substances/substance/entities/psychoactive-class.enum";
import {
	RouteOfAdministration,
	RouteOfAdministrationType,
} from "../../../../modules/substances/route-of-administration/entities/route-of-administration.entity";
import { Substance } from "../../../../modules/substances/substance/entities/substance.entity";

export const Mescaline: Substance = new Substance(
	{
		name: "Mescaline",
		chemnicalNomencalture: new ChemicalNomenclature({
			commonNames: ["Mescaline", "Peyote", "San Pedro", "Cactus", "Buttons"],
			substitutiveName: "3,4,5-Trimethoxyphenethylamine",
			systematicName: "2-(3,4,5-Trimethoxyphenyl)ethanamine",
		}),
		classMembership: new ClassMembership({
			psychoactiveClass: PsychoactiveClass.psychedelic,
			chemicalClass: "phenetylamine",
		}),
		administrationRoutes: [
			new RouteOfAdministration({
				route: RouteOfAdministrationType.oral,
				_substance: "Mescaline",
				bioavailability: 0.8,
				dosage: {
					thereshold: 50,
					light: 100,
					moderate: 200,
					strong: 400,
					heavy: 800,
					overdose: 1000,
				},
				duration: {
					onset: ms("90m"),
					comeup: ms("120m"),
					peak: ms("6h"),
					offset: ms("3h"),
					aftereffects: ms("36h"),
				},
			}),
		],
		effects: [],
	},
	"mescaline",
);
