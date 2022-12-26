import ms from "ms";
import { Substance } from "../../../../modules/substance/entity";
import { PsychoactiveClass } from "../../../../modules/substance/entities/psychoactive-class.enum";
import { RouteOfAdministration } from "../../../../modules/substance/entities/route-of-administration.entity";
import { RouteOfAdministrationClassification } from "../../../../modules/substance/entities/route-of-administration-classification.enum";
import { TimeRange } from "../../../../utilities/range.vo";
import { MassUnit } from "../../../../utilities/mass.vo";

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
				thereshold: MassUnit.fromString("10mg"),
				light: MassUnit.fromString("20mg"),
				moderate: MassUnit.fromString("50mg"),
				strong: MassUnit.fromString("150mg"),
				heavy: MassUnit.fromString("500mg"),
				overdose: MassUnit.fromString("1g"),
			},
			duration: {
				onset: TimeRange.fromString("5m-10m"),
				comeup: TimeRange.fromString("10m-60m"),
				peak: TimeRange.fromString("1h-2h"),
				offset: TimeRange.fromString("6h-10h"),
				aftereffects: TimeRange.fromString("2h-4h"),
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
