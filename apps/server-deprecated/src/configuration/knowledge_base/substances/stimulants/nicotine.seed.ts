import ms from "ms";
import { ChemicalNomenclature } from "../../../../modules/substances/substance/entities/chemical-nomenclature";
import { ClassMembership } from "../../../../modules/substances/substance/entities/class-membership.entity";
import { PsychoactiveClass } from "../../../../modules/substances/substance/entities/psychoactive-class.enum";
import {
	RouteOfAdministration,
	RouteOfAdministrationType,
} from "../../../../modules/substances/route-of-administration/entities/route-of-administration.entity";
import { Substance } from "../../../../modules/substances/substance/entities/substance.entity";

export const Nicotine: Substance = new Substance(
	{
		name: "Nicotine",
		chemnicalNomencalture: new ChemicalNomenclature({
			commonNames: ["Nicotine"],
			substitutiveName: "(S)-3-[1-Methylpyrrolidin-2-yl]pyridine",
			systematicName: "(S)-3-[1-Methylpyrrolidin-2-yl]pyridine",
		}),
		classMembership: new ClassMembership({
			psychoactiveClass: PsychoactiveClass.stimulant,
			chemicalClass: "pyridine",
		}),
		administrationRoutes: [
			new RouteOfAdministration({
				route: RouteOfAdministrationType.smoked,
				_substance: "Nicotine",
				bioavailability: 0.8,
				dosage: {
					thereshold: 0.2,
					light: 0.8,
					moderate: 1.5,
					strong: 3.5,
					heavy: 3.5,
					overdose: 1000,
				},
				duration: {
					onset: ms("20s"),
					comeup: ms("10s"),
					peak: ms("5m"),
					offset: ms("2h"),
					aftereffects: ms("3h"),
				},
			}),
		],
		effects: [],
	},
	"nicotine",
);
