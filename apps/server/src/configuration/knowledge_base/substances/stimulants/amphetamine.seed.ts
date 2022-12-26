/* eslint-disable node/file-extension-in-import */
import ms from "ms";
import { Substance } from "../../../../modules/substance/entity";
import { PsychoactiveClass } from "../../../../modules/substance/entities/psychoactive-class.enum";
import { RouteOfAdministration } from "../../../../modules/substance/entities/route-of-administration.entity";
import { RouteOfAdministrationClassification } from "../../../../modules/substance/entities/route-of-administration-classification.enum";
import { MassUnit } from "../../../../utilities/mass.vo";
import { TimeRange } from "../../../../utilities/range.vo";

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
				thereshold: MassUnit.fromString("4mg"),
				light: MassUnit.fromString("6mg"),
				moderate: MassUnit.fromString("15mg"),
				strong: MassUnit.fromString("30mg"),
				heavy: MassUnit.fromString("50mg"),
				overdose: MassUnit.fromString("100mg"),
			},
			duration: {
				onset: TimeRange.fromString("1m-5m"),
				comeup: TimeRange.fromString("30m-90m"),
				peak: TimeRange.fromString("1h-2h"),
				offset: TimeRange.fromString("1.5h-3h"),
				aftereffects: TimeRange.fromString("2h-4h"),
			},
		}),
		new RouteOfAdministration({
			classification: RouteOfAdministrationClassification.oral,
			bioavailability: 0.8,
			dosage: {
				thereshold: MassUnit.fromString("2.5mg"),
				light: MassUnit.fromString("5mg"),
				moderate: MassUnit.fromString("15mg"),
				strong: MassUnit.fromString("30mg"),
				heavy: MassUnit.fromString("50mg"),
				overdose: MassUnit.fromString("100mg"),
			},
			duration: {
				onset: TimeRange.fromString("30m-45m"),
				comeup: TimeRange.fromString("30m-135m"),
				peak: TimeRange.fromString("2.5h-4h"),
				offset: TimeRange.fromString("2h-3h"),
				aftereffects: TimeRange.fromString("3h-6h"),
			},
		}),
	],
});
