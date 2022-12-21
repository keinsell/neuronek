import ms from "ms";
import { Substance } from "../../../../modules/substance/entity";
import { PsychoactiveClass } from "../../../../modules/substance/entities/psychoactive-class.enum";
import { RouteOfAdministration } from "../../../../modules/substance/entities/route-of-administration.entity";
import { RouteOfAdministrationClassification } from "../../../../modules/substance/entities/route-of-administration-classification.enum";
import { NumberRange, TimeRange } from "../../../../utilities/range.vo";

export const Caffeine: Substance = new Substance({
	name: "Caffeine",
	description:
		"Caffeine is a a CNS stimulant, and also the most widely used psychoactive substance in the world. It is legal and unregulated in most parts of the world, and is found in many commonly sold products. It has a good safety profile, though regular heavy use can cause physical dependence and contribute to certain medical conditions.",
	chemicalNomencalture: {
		common: ["Caffeine", "Coffee"],
		substitutive: "1,3,7-Trimethylxanthine",
		systematic: "1,3,7-Trimethylpurine-2,6-dione",
	},
	psychoactiveClass: PsychoactiveClass.stimulant,
	chemicalClass: "xanthine",
	administrationBy: [
		new RouteOfAdministration({
			classification: RouteOfAdministrationClassification.oral,
			bioavailability: 0.8,
			dosage: {
				thereshold: 10000,
				light: 20000,
				moderate: 50000,
				strong: 150000,
				heavy: 500000,
				overdose: 1000000,
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
	addiction: {
		tolerance: {
			toleranceReversal: {
				reversalToHalf: new TimeRange(ms("3d"), ms("7d")),
				reversalToBaseline: new TimeRange(ms("7d"), ms("14d")),
			},
		},
	},
});
